# 🎧 Spotify Persona Engine

## 🚀 Overview

**Spotify Persona Engine** is a sophisticated full-stack application designed to decode the psychology behind your music taste. By seamlessly connecting with your Spotify account, it dives deep into your listening habits, extracting patterns that define who you are—or who you pretend to be.

Unlike standard music summaries, this engine leverages the power of **Groq's Llama 3.3 70B** Large Language Model to generate highly personalized, context-aware insights. Whether you're looking for a serious psychological breakdown of your emotional tendencies or a savage, meme-worthy roast of your guilty pleasures, the Persona Engine delivers results with premium speed and accuracy.

Built with a modern, aesthetic-first philosophy, the application features a dark-mode interface that puts your music front and center. It operates with a strict privacy-first approach, ensuring that your data is analyzed in real-time and never stored, offering a safe space to explore the hidden layers of your sonic identity.

## ✨ Features

- **🔐 Seamless OAuth Login**: Secure authentication directly via Spotify.
- **📂 Intelligent Playlist Fetching**: Automatically retrieves and visualizes your user playlists.
- **🧠 Deep Personality Analysis**: AI-driven psychological profiling based on your top tracks.
- **🔥 Savage Roast Mode**: A humorous, "no-holds-barred" critique of your music taste.
- **⚡ Smart Sampling Pipeline**: Selects top playlists and samples tracks for a representative profile.
- **🎨 Premium UI**: A sleek, responsive React frontend with modal-based interactions.
- **🛡️ Privacy Centric**: Zero database storage; all analysis happens in-memory.

## 🛠️ Tech Stack

### Frontend
- **React**: Component-based UI architecture.
- **Vite**: Blazing fast build tool and dev server.
- **CSS Modules**: Modular and scoped styling for a clean aesthetic.

### Backend
- **Node.js**: Robust JavaScript runtime.
- **Express**: Minimalist web framework for API routing.

### AI & Integrations
- **Groq SDK**: Interface for high-performance LLM inference (Llama 3.3 70B).
- **Spotify Web API**: Source for user profile, playlists, and track data.

## 📂 Folder Structure

```bash
spotify-persona-engine/
├── src/
│   ├── components/       # Reusable UI components (AIResultModal, etc.)
│   ├── App.jsx           # Main application logic & routing
│   ├── PlaylistGallery.jsx # Playlist visualization & interaction
│   ├── server.js         # Express backend & API endpoints
│   ├── spotifyHelpers.js # Data fetching, filtering & sampling logic
│   └── index.css         # Global styles & variables
├── .env                  # Environment configuration
├── package.json          # Project dependencies & scripts
└── vite.config.js        # Vite proxy & build config
```

## ⚙️ Installation & Setup

Follow these steps to get the engine running locally.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/AbhinavReddy/spotify-persona-engine.git
    cd spotify-persona-engine
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Start the Frontend**
    Run the Vite development server (default port: 5173).
    ```bash
    npm run dev
    ```

5.  **Start the Backend**
    Run the Express server (default port: 3000).
    ```bash
    # In a new terminal window
    node src/server.js
    ```

6.  **Launch**
    Open your browser and navigate to `http://localhost:5173`.

## 🔑 Spotify OAuth Flow

1.  **Initiation**: User clicks "Login with Spotify" on the frontend.
2.  **Redirect**: App redirects to Spotify's secure authorization page.
3.  **Approval**: User grants permission (`playlist-read-private`, `playlist-read-collaborative`).
4.  **Callback**: Spotify redirects to the backend `/callback` route with an authorization code.
5.  **Exchange**: Backend swaps the code for an **Access Token** via Spotify API.
6.  **Handoff**: Backend redirects user back to the frontend with the token in the URL.

## 📡 API Endpoints

The backend exposes specialized endpoints for AI generation.

### `POST /api/analyze`
Generates a structured personality profile.
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: `{}`
- **Response**: JSON object with the AI-generated analysis string.

### `POST /api/roast`
Generates a humorous roast of the user's taste.
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: `{}`
- **Response**: JSON object with the AI-generated roast string.

## 🔬 Data Pipeline Explained

The engine follows a strict pipeline to ensure accurate and efficient analysis:

1.  **Fetch**: Retrieve all playlists from the authenticated user.
2.  **Filter**: Identify the **Top 10** playlists based on track count to focus on significant data.
3.  **Sample**: Randomly select **50 tracks** from each of the top playlists to build a representative dataset.
4.  **Summarize**: Aggregate track names and playlist metadata into a compact JSON summary.
5.  **Groq Inference**: Send the summary to the Groq LLM with a specialized system prompt.
6.  **Result**: Return the generated insight to the frontend for display.

## 🔒 Privacy

**Your data is yours.**
- We do **not** store your Spotify data.
- We do **not** have a database.
- Access tokens are stored only in your browser's local state.
- All analysis is performed in-memory and discarded immediately after the request completes.

## 📸 Screenshots

<img width="1825" height="859" alt="Screenshot 2025-11-30 165223" src="https://github.com/user-attachments/assets/816dc3cb-1f95-43ee-8c55-9945a6196324" />

## 🤝 Contributing

Contributions are welcome! To contribute:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

## 👨‍💻 Author

**Abhinav Reddy**

- LinkedIn: [Abhinav Reddy](https://linkedin.com/in/abhinavreddyadla)

---

*Built with code, coffee, and good music.*
