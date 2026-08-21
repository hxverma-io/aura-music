<div align="center">

# 🎵 Aura Music v1.0
### Next-Generation High-Fidelity Audio Streaming & AI Lyrics Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Security: Clean](https://img.shields.io/badge/Security-Audit%20Passed-brightgreen.svg)](#-security--privacy-guarantees)
[![Audio](https://img.shields.io/badge/Audio-320kbps%20Lossless-ef233c.svg)](https://github.com/hxverma-io)
[![Creator](https://img.shields.io/badge/Creator-@hxverma--io-000000.svg?logo=github)](https://github.com/hxverma-io)

<p align="center">
  <strong>An ultra-fast, database-backed, audio-first streaming platform featuring real-time stream decryption, AI lyrics identification, Web Audio DSP 10-Band Graphic Equalizer, offline caching, and fluid glassmorphic design.</strong>
</p>
---

</div>

## 🌟 Why Aura Music is Better

| Feature | Aura Music v1.0 | Standard Music Webapps |
| :--- | :--- | :--- |
| **Audio Stream Quality** | **100% Full-Length 320kbps MP4/M4A** (3 to 6 mins) | ❌ 30-sec previews / iframe blocks |
| **Album Art Fidelity** | **500x500 Ultra-HD Cover Art** with fallbacks | ❌ Low-res 50x50 thumbnails or broken images |
| **Audio DSP Processing** | **Web Audio 10-Band Equalizer, Bass Boost & Spatial** | ❌ Basic HTML audio player only |
| **AI Lyrics Intelligence** | **Identifies songs from typed lyrics & plays immediately** | ❌ Title/Artist exact search only |
| **Offline Storage** | **IndexedDB Audio Caching + Direct 10MB Device Downloads** | ❌ No offline listening or download |
| **Playlist Management** | **Interactive 1-Click Multi-Playlist Selector Modal** | ❌ Rigid or non-persistent playlists |
| **UI / UX Experience** | **Fluid Glassmorphism, Neon Accents, Dark/Amoled Themes** | ❌ Generic AI template design |

---

## ⚡ Featured Master Showcase (Creator Curations)
Aura Music comes pre-configured with the official **Himanshu Verma Master Favorites** in full 320kbps audio:
* 🎸 **Mary On A Cross** — *Ghost*
* 🖤 **I Wanna Be Yours** — *Arctic Monkeys*
* 🌟 **Die With A Smile** — *Lady Gaga & Bruno Mars*
* 🌧️ **Pal Pal X Talwinder** — *Aditya Likhari & Talwiinder*

---

## 🧠 AI Lyrics-to-Music Finder

Aura Music includes an integrated **Lyrics Identification Engine**. Type any lyric phrase into the AI Assistant chat tab:

```
"I wanna be your vacuum cleaner" ──▶ Automatically matches "I Wanna Be Yours" (Arctic Monkeys)
"Mary on a cross"               ──▶ Automatically matches "Mary On A Cross" (Ghost)
"Pal pal jeena mahal"           ──▶ Automatically matches "Pal Pal X Talwinder" (Talwiinder)
"Kehndi hundi si chan tak raah" ──▶ Automatically matches "Excuses" (AP Dhillon)
```

The AI returns full interactive track cards right in the chat with **1-Click Play**, **Add to Playlist**, **Like**, and **Direct Device Download** buttons.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) v18 or later
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/hxverma-io/aura-music.git
cd aura-music
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

The application will launch concurrently:
* 🌐 **Frontend**: `http://localhost:5173/`

---

## ⚖️ Legal & Copyright Disclaimer

> [!NOTE]
> **Fair Use & Non-Commercial Educational Notice**:
> Aura Music is an open-source research and educational project demonstrating client-side Web Audio DSP engineering, responsive UI design, and AI metadata parsing.
> 
> * **No Hosted Media**: Aura Music does **not** host, store, or archive copyrighted media files on its servers. All audio streams and album art are dynamically fetched on-demand from publicly accessible content distribution networks.
> * **Intellectual Property**: All song titles, audio recordings, artist names, trademarks, and cover artwork belong strictly to their respective copyright holders and artists.
> * **Commercial Use**: This repository is distributed under the MIT License solely for educational and portfolio demonstration purposes.

---

## 📁 Project Architecture

```
aura-music/
├── server/                     # Express Audio & Authentication Backend
│   ├── routes/
│   │   ├── ai.js               # AI Lyrics & Playlist Generation Engine
│   │   ├── auth.js             # User Auth, Profiles & JWT Tokens
│   │   ├── music.js            # Full-length 320kbps catalog & audio proxy
│   │   └── social.js           # Creator showcase & playlist metadata
│   ├── db.js                   # JSON database manager
│   └── index.js                # Server entry point
├── src/                        # React 19 + TypeScript Frontend
│   ├── components/
│   │   ├── dashboard/          # TrackCard, HeroCarousel, Slider
│   │   ├── layout/             # Sidebar, TopNav, FloatingDock
│   │   ├── player/             # FullscreenPlayer, EqualizerModal, Queue
│   │   └── playlist/           # AddToPlaylistModal, CreatePlaylistModal
│   ├── context/
│   │   ├── AudioContext.tsx    # Web Audio DSP, Equalizer & Playback Engine
│   │   ├── AuthContext.tsx     # Session state & User Profile
│   │   └── DataContext.tsx     # Library, Liked Tracks, Playlists & Offline
│   ├── services/
│   │   ├── audioService.ts     # HTML5 Audio + Web Audio Gain/Filters
│   │   ├── offlineService.ts   # IndexedDB local audio caching
│   │   └── apiService.ts       # Backend REST API client
│   ├── views/                  # Home, Explore, Library, AI Chat, Social
│   ├── App.tsx
│   └── index.css               # Fluid glassmorphic styling & themes
├── DEPLOYMENT_GUIDE.md         # Detailed open-source deployment manual
├── LICENSE                     # MIT Open Source License
└── package.json
```

---

## 👤 Project Creator & Maintainer

**Himanshu Verma (@hxverma-io)**
* 🐙 GitHub: [@hxverma-io](https://github.com/hxverma-io)
* 📸 Instagram: [@hxverma.io](https://www.instagram.com/hxverma.io/)
* 💼 Role: Creator & Lead Architect

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
