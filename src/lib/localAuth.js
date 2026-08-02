// Account system backed by GitHub storage (api/storage.js).
// Sign-up/sign-in accounts live in the GitHub repo, so a user can log in from
// any device/browser with the same email + password. The session is cached in
// localStorage so the user stays logged in on refresh.

const SESSION_KEY = 'sahayak_session'

const listeners = new Set()
let current = null

function persist(user) {
  current = user
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(user))
}

export function getSessionUser() {
  if (current) return current
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    current = JSON.parse(raw)
  } catch {
    current = null
  }
  return current
}

async function sha256(text) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return 'h' + h.toString(16)
}

export async function localSignUp(name, email, password) {
  const em = email.trim().toLowerCase()
  const salt = Math.random().toString(36).slice(2, 10)
  const passHash = await sha256(salt + ':' + password)

  let res
  try {
    res = await fetch('/api/account?email=' + encodeURIComponent(em), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: em, displayName: name.trim(), salt, passHash }),
    })
  } catch {
    const err = new Error('network-error')
    err.code = 'auth/network-request-failed'
    throw err
  }
  if (res.status === 409) {
    const err = new Error('email-taken')
    err.code = 'auth/email-already-in-use'
    throw err
  }
  if (!res.ok) {
    const err = new Error('signup-failed')
    err.code = 'auth/signup-failed'
    throw err
  }
  const data = await res.json()
  const user = { uid: data.uid, email: em, displayName: data.displayName, isLocal: true }
  persist(user)
  return user
}

export async function localSignIn(email, password) {
  const em = email.trim().toLowerCase()

  let res, data
  try {
    res = await fetch('/api/account?email=' + encodeURIComponent(em))
    data = await res.json().catch(() => ({}))
  } catch {
    const err = new Error('network-error')
    err.code = 'auth/network-request-failed'
    throw err
  }
  const acct = data.account
  if (!acct) {
    const err = new Error('user-not-found')
    err.code = 'auth/user-not-found'
    throw err
  }
  const passHash = await sha256(acct.salt + ':' + password)
  if (passHash !== acct.passHash) {
    const err = new Error('wrong-password')
    err.code = 'auth/wrong-password'
    throw err
  }
  const user = { uid: acct.uid, email: em, displayName: acct.displayName, isLocal: true }
  persist(user)
  return user
}

export function localSignOut() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  current = null
  listeners.forEach((fn) => fn(null))
}

export function subscribeLocalAuth(fn) {
  listeners.add(fn)
  fn(getSessionUser())
  return () => listeners.delete(fn)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === SESSION_KEY) {
      current = null
      listeners.forEach((fn) => fn(getSessionUser()))
    }
  })
}