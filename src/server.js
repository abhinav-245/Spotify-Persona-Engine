import express from 'express';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Groq from "groq-sdk";
import cors from 'cors';
import { processPlaylistsForAI } from './spotifyHelpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (one level up from src)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildPersonalityPrompt(summaryJson) {
    return `
You are a premium personality-analysis engine for a Spotify playlist analyzer.

Write the output in a highly structured, crisp, aesthetic, modern style.  
Avoid long paragraphs. Avoid repetition. Avoid generic analysis.

Format the response using these sections only:

### 🔥 Emotional Tendencies  
(3–5 sharp bullet points revealing real insights. No generic statements.)

### 🎧 Vibe Profile  
(Short bullets describing mood patterns, listening energy, aesthetic themes.)

### 🧠 Social Signals  
(What their playlists suggest about social behavior—short bullets only.)

### 🌑 Hidden Layers  
(Deep traits, but expressed in 2–3 bold, punchy lines. No flattery.)

### 🎭 Music Archetype  
(Give ONE archetype name that sounds premium.  
Examples: “Emotional Explorer”, “Sonic Nomad”, “Intensity Seeker”, “Aesthetic Dreamer”)

### 🪞 Mental Landscape  
(3–4 lines describing what their playlists reveal about their mental space.)

### ⚡ One-Sentence Summary  
(A single killer one-liner. Poetic, aesthetic, memorable.)

Write in a modern, minimal, aesthetic tone.  
Use **bullet points**, **bold text** for keywords, and **short sentences**.  
Output should look premium and Instagram-caption worthy.

PLAYLIST SUMMARY (JSON):
${JSON.stringify(summaryJson, null, 2)}
`;
}

function buildRoastPrompt(summaryJson) {
    return `
You are a funny, sarcastic playlist roasting engine.

Your tone:  
– playful  
– clever  
– lightly insulting  
– NEVER hurtful  
– Gen-Z + meme energy  
– short punches, not essays  

Structure the roast as follows:

### 😂 Opening Roast  
(2–3 lines that roast their overall music personality.)

### 🔥 Playlist-by-Playlist Roast  
For each playlist provided:  
- Give ONE roast line only.  
- Make it VERY funny.  
- Make it specific to that playlist’s vibe (chill → sleepy jokes, gym → rage jokes, etc.)

### 💀 Final Killshot  
(One savage but funny finishing line.)

Keep it extremely tight.  
Do NOT write long paragraphs.  
Do NOT explain anything.  
Deliver pure comedy.

PLAYLIST SUMMARY (JSON):
${JSON.stringify(summaryJson, null, 2)}
`;
}

const app = express();

// Enable CORS for frontend - Allow all origins temporarily for debugging
app.use(cors({
    origin: true, // Reflects the request origin, effectively allowing all
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://spotify-persona-backend.onrender.com/callback';

// 1) Redirect user to Spotify to authorize
app.get('/login', (req, res) => {
    const scope = 'playlist-read-private playlist-read-collaborative';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
        qs.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI
        });
    res.redirect(authUrl);
});

// 2) Callback: exchange code for tokens
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const tokenResp = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });

        const { access_token, refresh_token } = tokenResp.data;

        // Redirect to frontend with tokens only
        // In production, redirect to the root path (served by express static)
        // In development, redirect to the Vite dev server
        const frontendBase = process.env.NODE_ENV === 'production'
            ? (process.env.FRONTEND_URL || '/')
            : 'http://127.0.0.1:5173';

        const frontendUrl = `${frontendBase}?access_token=${access_token}&refresh_token=${refresh_token}`;

        res.redirect(frontendUrl);

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).send('Auth exchange failed: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
    }
});

// 3) API Endpoint to fetch playlists
app.get('/api/playlists', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const playlistsResp = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                'Authorization': authHeader
            }
        });
        res.json({ playlists: playlistsResp.data.items });
    } catch (err) {
        console.error('Playlist fetch error:', err.response ? err.response.data : err.message);
        const status = err.response ? err.response.status : 500;
        const spotifyError = err.response?.data?.error;
        const errorMessage = (typeof spotifyError === 'string' ? spotifyError : spotifyError?.message) || err.message || 'Unknown error';

        res.status(status).json({ error: 'Failed to fetch playlists', details: errorMessage });
    }
});

// 4) Analyze Endpoint
app.post('/api/analyze', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // Extract token from "Bearer <token>"
    const accessToken = authHeader.split(' ')[1];

    try {
        const summary = await processPlaylistsForAI(accessToken);

        const prompt = buildPersonalityPrompt(summary);

        const groqResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a music analysis expert." },
                { role: "user", content: prompt }
            ],
            max_tokens: 4000
        });

        const aiText = groqResponse.choices?.[0]?.message?.content || "No response";
        return res.json({
            success: true,
            message: aiText,
            raw: summary
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Analysis failed'
        });
    }
});

// 5) Roast Endpoint
app.post('/api/roast', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // Extract token from "Bearer <token>"
    const accessToken = authHeader.split(' ')[1];

    try {
        const summary = await processPlaylistsForAI(accessToken);

        const prompt = buildRoastPrompt(summary);

        const groqResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a comedy roast expert." },
                { role: "user", content: prompt }
            ],
            max_tokens: 3000
        });

        const aiText = groqResponse.choices?.[0]?.message?.content || "No response";
        return res.json({
            success: true,
            message: aiText,
            raw: summary
        });
    } catch (error) {
        console.error('Roast error:', error);
        res.status(500).json({
            success: false,
            error: 'Roast failed'
        });
    }
});

// Serve static files from the React build (dist) ONLY in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    // Handle SPA routing: serve index.html for any unknown routes
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`App running on http://127.0.0.1:${PORT}`));