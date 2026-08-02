// Sahayak website knowledge base.
// Injected server-side into the AI system prompt so the chatbot only answers
// from real website content and never invents facts.

export default `
# Sahayak — Website Knowledge Base

## About
Sahayak is a free, smart AI voice assistant web app. You can talk to it using your voice,
save personal notes, manage tasks, and get instant help — all inside your browser.
It is built with React 19 + Vite and hosted on Vercel. It is 100% free forever.

## Features
- AI Voice Assistant: speak with the mic (Web Speech API) and get spoken replies. Works for basic commands without any API key.
- Smart Chat Brain: handles time, date, math, jokes, motivation, notes and task quick-commands offline.
- Optional Gemini AI: paste a free Google AI Studio API key in Settings to unlock unlimited answers.
- Futuristic particle network background that follows your mouse.
- Personal Notes and Task Manager, saved per user.
- Guest mode: data is stored in your browser (localStorage). No account needed.
- Sign in with Google or Email (Firebase Auth) to sync data to the cloud.
- Dark / Light mode and Hindi + English interface.
- Installable PWA that works offline.

## Pricing
Sahayak is completely free. There are no paid plans and no hidden costs.
Optional integrations (Firebase, Gemini AI) use their free tiers.

## How to use
- Click "Start Talking" on the home page, or open the Assistant page.
- Use the mic button to speak, or type a message and press Enter.
- Try commands like: "what time is it", "tell me a joke", "what is 25*4", "motivate me".
- Go to "My Dashboard" to create Tasks (✅) and Notes (📝).
- Open Settings (⚙️) to toggle dark mode, switch language, enable voice replies, or add a Gemini API key.
- Use the floating chat button (bottom-right) to ask questions about this website.

## FAQ
- Is Sahayak really free? Yes. There are no plans or payment anywhere.
- Do I need an account? No. Guest mode works instantly in your browser.
- Is my data safe? Guest data stays in your browser. With a Firebase account, data is private and synced to your own account.
- Which browsers support voice? Google Chrome and Microsoft Edge work best.
- Can I install it on my phone? Yes. It is a PWA — use the browser menu to "Install app".
- What if the AI does not know something? It will politely tell you instead of guessing.

## Tech stack
React 19, Vite, CSS, Web Speech API, Canvas particle background, Firebase (optional), hosted on Vercel.
The chat uses a Vercel serverless function (api/chat) that securely calls Gemini or OpenAI.

## Developer setup
- Local: npm install, then npm run dev.
- Chat API locally: run npx vercel dev instead of npm run dev.
- Deploy: push to GitHub, then import the repo on Vercel.
- Environment variables for the chat backend: GEMINI_API_KEY (free from aistudio.google.com) or OPENAI_API_KEY.

## Contact
Sahayak is made with love for everyone. For feedback, open the Settings menu and reach out.

## Rules for the assistant
Answer ONLY using this knowledge base. Be friendly and concise. Use Markdown when helpful.
If a question is not covered here, politely say you do not have that information and suggest asking about website features, pricing, or how to use it. Never make up answers.
`
