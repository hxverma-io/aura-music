# 🚀 Open-Source & Free Domain Deployment Guide — Aura Music

Complete step-by-step guide to open-source your repository on GitHub and deploy it live with a custom domain on **Vercel** & **Render / Railway** for 100% free hosting.

---

## 📦 Part 1: How to Open-Source on GitHub

### Step 1: Initialize Git Repository
In your project root directory (`c:\Users\hv496\OneDrive\Desktop\Music System`):

```bash
# 1. Initialize git
git init

# 2. Check status (ensure .gitignore excludes node_modules and .env)
git status

# 3. Add all project files
git add .

# 4. Create your initial commit
git commit -m "feat: Aura Music - High-fidelity streaming, AI lyrics discovery & Web Audio DSP"
```

### Step 2: Push to Your GitHub Account
1. Open [https://github.com/new](https://github.com/new).
2. Create a new repository named `aura-music` (Set to **Public**).
3. Push your code:

```bash
# Rename branch to main
git branch -M main

# Link to your GitHub account (@hxverma-io)
git remote add origin https://github.com/hxverma-io/aura-music.git

# Push the code
git push -u origin main
```

---

## 🌐 Part 2: Deploy Frontend to Vercel (With Free Domain)

Vercel provides free, high-speed global CDN deployment with automatic SSL certificates and `.vercel.app` domains.

### Step 1: Connect to Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account (`@hxverma-io`).
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Select your `aura-music` repository and click **Import**.

### Step 2: Configure Build Settings
* **Framework Preset**: `Vite`
* **Root Directory**: `./`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

### Step 3: Deploy
Click **"Deploy"**. In ~30 seconds, Vercel will give you a live production URL like:
👉 **`https://aura-music-hxverma.vercel.app`**

---

## ⚙️ Part 3: Deploy Backend API (Express Server) on Render / Railway

Because our app uses an Express API (`server/index.js`) for full-length 320kbps stream decryption and proxying, host the backend on **Render.com** (Free Tier) or **Railway.app**:

### Deploying on Render:
1. Go to [https://render.com](https://render.com) and Sign In with GitHub.
2. Click **"New +"** $\rightarrow$ **"Web Service"**.
3. Connect your `aura-music` repo.
4. Settings:
   - **Name**: `aura-music-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
5. Click **"Create Web Service"**.
6. Render will provide a live API URL like `https://aura-music-api.onrender.com`.

### Linking Frontend to Backend on Vercel:
In your Vercel Project Dashboard:
1. Go to **Settings** $\rightarrow$ **Environment Variables**.
2. Add:
   - `VITE_API_URL` = `https://aura-music-api.onrender.com/api`
3. Click **Redeploy**.

---

## 🔗 Part 4: How to Add Your Custom Domain (e.g. `hxverma.io` or `music.hxverma.io`)

1. In your **Vercel Project Dashboard**, go to **Settings** $\rightarrow$ **Domains**.
2. Enter your custom domain (e.g. `music.hxverma.io` or `auramusic.io`).
3. Click **Add**.
4. In your DNS Provider (Cloudflare / Namecheap / GoDaddy), add the CNAME record shown by Vercel:
   - **Type**: `CNAME`
   - **Name**: `music` (or `@` for apex domain)
   - **Value**: `cname.vercel-dns.com`
5. Within 5 minutes, your domain will be live with free automatic SSL (`https://`)!

---

## 💻 Part 5: How Anyone Can Clone and Run Your Project

Add this into your GitHub `README.md` so other developers can run it in seconds:

```bash
# Clone the open source repository
git clone https://github.com/hxverma-io/aura-music.git

# Enter the project directory
cd aura-music

# Install dependencies
npm install

# Start both Express backend and Vite frontend concurrently
npm run dev
```

The app will be running at `http://localhost:5173/` with full-length 320kbps audio playback!
