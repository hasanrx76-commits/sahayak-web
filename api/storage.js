// Sahayak data storage API — Vercel serverless function.
//
// Stores each signed-in user's notes/todos as a JSON file in a GitHub repo,
// using the GitHub Contents API. No database required — the GitHub repo IS
// the database.
//
// Setup (Vercel → Settings → Environment Variables, then redeploy):
//   GITHUB_TOKEN      — Personal Access Token (scopes: repo)
//   GITHUB_DATA_REPO  — "owner/repo" (a PRIVATE repo is strongly recommended)
//   GITHUB_BRANCH     — branch to write to (default "main")
//   APP_SECRET        — random string; salts the per-user filename
//
// Per-user isolation: the file name is sha256(uid + APP_SECRET), so a client
// cannot read or overwrite another user's file.

import crypto from 'node:crypto'

// ---- In-memory rate limiter (best-effort per instance) ----
const buckets = new Map()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 60

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

const GITHUB_API = 'https://api.github.com'
const TOKEN = process.env.GITHUB_TOKEN || ''
const REPO = process.env.GITHUB_DATA_REPO || ''
const BRANCH = process.env.GITHUB_BRANCH || 'main'
const SECRET = process.env.APP_SECRET || 'sahayak'
const DIR = 'data'

function configured() {
  return Boolean(TOKEN && REPO)
}

function filePath(uid) {
  const key = crypto.createHash('sha256').update(String(uid) + SECRET).digest('hex')
  return `${DIR}/${key}.json`
}

// Stable uid derived from email (same account -> same uid on any device).
function uidForEmail(email) {
  return 'local-' + crypto.createHash('sha256').update(email + SECRET).digest('hex').slice(0, 10)
}

function accountPath(email) {
  const key = crypto.createHash('sha256').update(email + SECRET).digest('hex')
  return `accounts/${key}.json`
}

async function ghRequest(method, path, body) {
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res
}

async function readFile(path) {
  const res = await ghRequest('GET', path)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`)
  const data = await res.json()
  return {
    sha: data.sha,
    json: JSON.parse(Buffer.from(data.content, 'base64').toString('utf8')),
  }
}

async function writeFile(path, json, sha) {
  const res = await ghRequest('PUT', path, {
    message: 'update sahayak data',
    content: Buffer.from(JSON.stringify(json)).toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  })
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`)
}

// ---- Route handler ----
export default async function handler(req, res) {
  if (!allowRequest(clientIp(req))) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a moment.' })
  }

  if (req.method === 'GET' && req.query.action === 'ping') {
    return res.json({ configured: configured() })
  }

  if (!configured()) {
    return res.status(501).json({ error: 'GitHub storage is not configured.' })
  }

  // ---- Account endpoints (after auth is configured) ----
  if (req.query.action === 'account') {
    const email = String(req.query.email || '').trim().toLowerCase()
    if (!email) return res.status(400).json({ error: 'An email is required for account actions' })
    try {
      const path = accountPath(email)
      if (req.method === 'GET') {
        const file = await readFile(path)
        return res.json({ account: file ? file.json : null })
      }
      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        const existing = await readFile(path)
        if (existing) {
          return res.status(409).json({ error: 'email-taken' })
        }
        const uid = uidForEmail(email)
        const account = {
          uid,
          email,
          displayName: String(body.displayName || '').slice(0, 80) || email.split('@')[0],
          salt: String(body.salt || ''),
          passHash: String(body.passHash || ''),
          createdAt: Date.now(),
        }
        await writeFile(path, account, null)
        return res.json({ uid, email, displayName: account.displayName })
      }
    } catch (err) {
      console.error('Account handler error:', err.message)
      return res.status(502).json({ error: 'Failed to talk to GitHub storage.' })
    }
  }

  const uid = String(req.query.uid || '').trim()
  if (!uid || uid.length > 200) {
    return res.status(400).json({ error: 'A valid "uid" is required' })
  }
  const path = filePath(uid)

  try {
    if (req.method === 'GET') {
      const file = await readFile(path)
      return res.json(file ? file.json : { todos: [], notes: [] })
    }

    if (req.method === 'POST') {
      const payload = req.body || {}
      const body =
        typeof payload === 'string'
          ? JSON.parse(payload)
          : payload
      const clean = {
        todos: Array.isArray(body.todos) ? body.todos : [],
        notes: Array.isArray(body.notes) ? body.notes : [],
      }
      const file = await readFile(path)
      await writeFile(path, clean, file ? file.sha : null)
      return res.json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Storage handler error:', err.message)
    return res.status(502).json({ error: 'Failed to talk to GitHub storage.' })
  }
}
