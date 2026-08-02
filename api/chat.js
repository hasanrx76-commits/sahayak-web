// Sahayak chat API — Vercel serverless function.
//
// - API keys (GEMINI_API_KEY / OPENAI_API_KEY) live ONLY on the server via
//   Vercel environment variables. They are never exposed to the browser.
// - Supports OpenAI-compatible streaming and Google Gemini streaming.
// - Streams Server-Sent Events (SSE) straight through to the client.
// - Includes per-IP rate limiting, input validation and error handling.

import knowledge from './lib/knowledge.js'

// ---- In-memory rate limiter ----
// Note: serverless instances are short-lived, so this is best-effort per
// instance. Good enough for a free app; upgrade to Vercel KV for durability.
const buckets = new Map()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 20

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers['x-real-ip'] || 'unknown'
}

function allowRequest(ip) {
  const now = Date.now()
  const hits = (buckets.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= MAX_PER_WINDOW) {
    buckets.set(ip, hits)
    return false
  }
  hits.push(now)
  buckets.set(ip, hits)
  return true
}

// ---- Helpers ----

function buildSystemPrompt() {
  return (
    'You are Sahayak, the friendly AI assistant for the Sahayak website.\n' +
    'Answer ONLY using the website knowledge base below. Be concise, friendly ' +
    'and helpful, and use Markdown when it improves the answer.\n' +
    'If the question is not covered by the knowledge base, politely say you do ' +
    'not have that information and suggest asking about website features, ' +
    'pricing, or how to use it. Never make up information.\n\n' +
    '===== WEBSITE KNOWLEDGE BASE =====\n' +
    knowledge +
    '\n===== END KNOWLEDGE BASE ====='
  )
}

// Forwards an upstream SSE stream straight to the client.
async function forwardStream(upstream, res) {
  if (!upstream.ok) {
    const text = (await upstream.text()).slice(0, 300)
    console.error('Upstream AI error:', upstream.status, text)
    return res.status(502).json({ error: `AI service error (${upstream.status})` })
  }
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')
  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value, { stream: true }))
    }
  } catch {
    // Client disconnected mid-stream; stop forwarding.
  }
  res.end()
}

// ---- Route handler ----
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  if (!allowRequest(clientIp(req))) {
    return res
      .status(429)
      .json({ error: 'Too many requests. Please wait a moment and try again.' })
  }

  // Parse and validate the request body
  let messages
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    messages = body?.messages
  } catch {
    return res.status(400).json({ error: 'Invalid request body' })
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A "messages" array is required' })
  }

  // Clamp history size and per-message length (performance + abuse control)
  const safe = messages.slice(-20).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: String(m.content || '').slice(0, 4000),
  }))

  const systemPrompt = buildSystemPrompt()
  const geminiKey = process.env.GEMINI_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  try {
    // Google Gemini (free tier recommended)
    if (geminiKey) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `${model}:streamGenerateContent?alt=sse&key=${geminiKey}`
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: safe.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      })
      return forwardStream(upstream, res)
    }

    // Groq — free, no credit card required, OpenAI-compatible streaming
    if (groqKey) {
      const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
      const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...safe],
          stream: true,
          temperature: 0.7,
          max_tokens: 800,
        }),
      })
      return forwardStream(upstream, res)
    }

    // OpenAI-compatible
    if (openaiKey) {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
      const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...safe],
          stream: true,
          temperature: 0.7,
        }),
      })
      return forwardStream(upstream, res)
    }

    return res.status(503).json({
      error:
        'The AI backend is not configured yet. Add a free GROQ_API_KEY (console.groq.com) ' +
        'or OPENAI_API_KEY in Vercel → Settings → Environment Variables, then redeploy.',
    })
  } catch (err) {
    console.error('Chat handler error:', err)
    return res.status(500).json({ error: 'Something went wrong on the server. Please try again.' })
  }
}
