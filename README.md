# 🤖 Sahayak — Smart AI Voice Assistant

A feature-rich, 100% free web app: futuristic particle network background, voice-enabled AI assistant, floating AI chatbot, personal notes, and task manager.

**Stack:** React 19 + Vite · Vercel serverless API · Firebase Auth + Firestore · Web Speech API · PWA · Markdown chat

## ✨ Features
- 🎙️ **Voice AI Assistant** — talk with the mic (Web Speech API), replies out loud (speech synthesis)
- 💬 **Floating AI Chatbot** — bottom-right button, real-time streaming, Markdown + code blocks, answers website questions
- 🧠 **Smart brain** — offline rules engine (time, date, math, jokes, motivation) + optional Gemini AI for unlimited answers
- ✨ **Futuristic particle network** — glowing points connected by light that follow your mouse
- 📝 **Personal Notes** + ✅ **Task Manager** — synced to your account
- 🔐 **Login** — Google or email via Firebase Auth
- 📱 **PWA** — installable, works offline
- 🌓 **Dark/Light mode**, 🌐 **Hindi + English**, ⚙️ Settings (voice toggle, Gemini key)

## 🚀 Run locally
```bash
npm install
npm run dev
```
> The floating chatbot needs the API backend. To run it locally use `npx vercel dev` instead of `npm run dev`.

## 💬 AI Chatbot setup (secure backend)

The chat uses a Vercel serverless function (`api/chat.js`) so **API keys stay hidden** on the server. It supports Groq (recommended, free), Gemini, or OpenAI.

1. **Groq (recommended):** get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create (no credit card needed)
2. In Vercel → project → **Settings → Environment Variables**, add:
   ```
   GROQ_API_KEY=<your free key>
   ```
   (or `GEMINI_API_KEY` / `OPENAI_API_KEY`; optionally set `GROQ_MODEL` / `OPENAI_MODEL`)
3. Redeploy (push to git). The floating chat button now answers questions about the website.

Backend features: per-IP rate limiting (20 req/min), input validation, message-length clamps, streaming SSE, graceful errors. Answers are limited to the site knowledge base (`api/lib/knowledge.js`) and it politely declines when it does not know.

## 🚀 Publish on Vercel (free)

### Option 1 — No Firebase (instant, guest mode)
Data is stored in your browser (localStorage).

1. Create a free account at [vercel.com](https://vercel.com) (or use GitHub login)
2. Push this folder to a GitHub repo, or use **Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   vercel --prod
   ```
3. Done! Vercel auto-detects Vite (`build: npm run build`, output `dist`).

### Option 2 — Full features with Firebase (recommended, still free)
Adds real user accounts + cloud data sync.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (Spark plan = free)
2. Enable **Authentication** → sign-in methods: **Google** + **Email/Password**
3. Enable **Firestore** → Create database → **production mode**
4. Firestore rules (paste in Firestore → Rules tab):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
5. Project Settings → Your apps → **Web app** → copy the config
6. In your Vercel project → **Settings → Environment Variables** add:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```
7. Redeploy (`vercel --prod` or push to git). Users can now sign up & sync their notes/tasks!

### 🧠 Free Gemini AI (optional)
1. Go to [aistudio.google.com](https://aistudio.google.com) → **Get API key** (free)
2. Users paste their key in the app's **Settings ⚙️** (or you can prefill it)
3. Now Sahayak answers anything, not just built-in commands.

## 📁 Project structure
```
src/
  ai/assistant.js        # Offline rules brain + Gemini API call
  components/            # Navbar, Home, Scene3D, Assistant, Auth, Dashboard, Settings, Footer
  contexts/AppContext.jsx # Theme, language, voice, Gemini key, user
  data.js                # Firestore/localStorage data layer
  firebase.js            # Firebase config (reads VITE_ env vars)
  hooks/useSpeech.js     # Speech recognition + synthesis
  i18n.js                # English + Hindi translations
public/
  manifest.json          # PWA manifest
  sw.js                  # Service worker
```
