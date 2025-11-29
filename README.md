# 🎧 Spotify Persona Engine

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React_%2B_Vite-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/backend-Node.js_%2B_Express-339933.svg?logo=node.js)
![Spotify](https://img.shields.io/badge/API-Spotify-1DB954.svg?logo=spotify)
![AI](https://img.shields.io/badge/AI-Groq_LLM-f55036.svg)

> **Your music taste, decoded by AI.**  
> A full-stack application that analyzes your Spotify playlists to reveal your hidden personality traits or roast your questionable music choices.

![Demo](https://via.placeholder.com/800x400?text=Demo+GIF+Placeholder)

---

## 🚀 Overview

**Spotify Persona Engine** connects to your Spotify account, fetches your top playlists, and uses advanced LLMs (via Groq) to generate deep psychological insights or hilarious roasts based on your listening habits.

Unlike generic "wrapped" clones, this engine samples your actual track data to build a comprehensive profile of who you are—or who you pretend to be.

## ✨ Features

- **🔐 Secure Spotify OAuth**: Seamless login with your Spotify account.
- **📂 Playlist Visualization**: View your top playlists in a sleek, responsive gallery.
- **🧠 Personality Analysis**: Get a structured psychological breakdown of your emotional tendencies, social signals, and "vibe profile."
- **🔥 Fun Roast**: Brave enough? Let the AI roast your music taste with savage, Gen-Z energy.
- **⚡ Fast AI Processing**: Powered by Groq for near-instant analysis.
- **🎨 Modern UI**: A premium, dark-mode aesthetic built with React and Vite.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS Modules
- **Backend**: Node.js, Express
- **AI/LLM**: Groq SDK (Llama-3.3-70b-versatile)
- **Data Source**: Spotify Web API
- **Authentication**: OAuth 2.0

## 📂 Folder Structure

```bash
spotify-persona-engine/
├── src/
│   ├── components/       # React components (AIResultModal, etc.)
│   ├── App.jsx           # Main frontend logic
│   ├── PlaylistGallery.jsx # Playlist display & interaction
│   ├── server.js         # Backend Express server & API routes
│   ├── spotifyHelpers.js # Data fetching & sampling logic
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## 🚀 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/spotify-persona-engine.git
    cd spotify-persona-engine
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your keys:
    ```env
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Start the Development Server**
    This command runs both the backend (port 3000) and frontend (port 5173).
    ```bash
    npm run dev
    # In a separate terminal for the backend if not concurrent:
    # node src/server.js
    ```

5.  **Open the App**
    Visit `http://localhost:5173` in your browser.

## 🔑 Spotify OAuth Flow

1.  User clicks **"Login with Spotify"**.
2.  Redirects to Spotify's secure authorization page.
3.  User approves access (scopes: `playlist-read-private`, `playlist-read-collaborative`).
4.  Spotify redirects back to `/callback` on the backend.
5.  Backend exchanges authorization code for **Access Token**.
6.  Backend redirects to Frontend with the token in the URL.

## 📡 API Endpoints

The backend exposes two primary endpoints for AI generation:

### `POST /api/analyze`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**: `{}`
*   **Response**: JSON object containing the structured personality analysis.

### `POST /api/roast`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**: `{}`
*   **Response**: JSON object containing a humorous roast of the user's taste.

## 🧬 How It Works (The Pipeline)

1.  **Fetch**: Retrieves all user playlists via Spotify API.
2.  **Filter**: Selects the **Top 10** playlists with the highest track counts.
3.  **Extract**: Fetches all track names for these playlists.
4.  **Sample**: Randomly selects **50 tracks** per playlist to create a representative sample.
5.  **Prompt**: Constructs a detailed prompt for the Groq LLM.
6.  **Generate**: The AI analyzes the track names to infer mood, genre, and personality traits.

## 📸 Screenshots

| Playlist Gallery | AI Analysis Modal |
|:---:|:---:|
| ![Gallery](https://via.placeholder.com/400x250?text=Playlist+Gallery) | ![Analysis](https://via.placeholder.com/400x250?text=AI+Analysis+Modal) |

## 🗺️ Roadmap

- [ ] **Shareable Cards**: Generate an image of your persona to share on Instagram/Twitter.
- [ ] **Compare with Friends**: Roast your friend's music taste.
- [ ] **Genre Breakdown**: Visual charts of your top genres.
- [ ] **History Analysis**: Analyze listening history (requires different scopes).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Abhinav Reddy**

- LinkedIn: [Abhinav Reddy](https://linkedin.com/in/abhinavreddyadla)

---

*Built with 🎧 and ☕.*
