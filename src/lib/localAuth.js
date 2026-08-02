// Local account system: email/password sign-in stored in the browser (localStorage).
// Used when Firebase is not configured. Data stays on this device only.

const USERS_KEY = 'sahayak_users'
const SESSION_KEY = 'sahayak_session'

const listeners = new Set()
let current = null

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function uid() {
  try {
    return crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)
  } catch {
    return Math.random().toString(36).slice(2, 10)
  }
}

function toPublic(u) {
  return { uid: u.uid, email: u.email, displayName: u.displayName, isLocal: true }
}

function emit(user) {
  current = user
  listeners.forEach((fn) => fn(user))
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

export function getSessionUser() {
  if (current) return current
  try {
    const id = localStorage.getItem(SESSION_KEY)
    if (!id) return null
    const u = readUsers().find((x) => x.uid === id)
    current = u ? toPublic(u) : null
  } catch {
    current = null
  }
  return current
}

export async function localSignUp(name, email, password) {
  const users = readUsers()
  const em = email.trim().toLowerCase()
  if (users.some((u) => u.email === em)) {
    const err = new Error('email-already-in-use')
    err.code = 'auth/email-already-in-use'
    throw err
  }
  const salt = Math.random().toString(36).slice(2, 10)
  const passHash = await sha256(salt + ':' + password)
  const user = {
    uid: 'local-' + uid(),
    displayName: name.trim() || em.split('@')[0],
    email: em,
    salt,
    passHash,
    createdAt: Date.now(),
  }
  users.push(user)
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, user.uid)
  emit(toPublic(user))
  return toPublic(user)
}

export async function localSignIn(email, password) {
  const em = email.trim().toLowerCase()
  const u = readUsers().find((x) => x.email === em)
  if (!u) {
    const err = new Error('user-not-found')
    err.code = 'auth/user-not-found'
    throw err
  }
  const passHash = await sha256(u.salt + ':' + password)
  if (passHash !== u.passHash) {
    const err = new Error('wrong-password')
    err.code = 'auth/wrong-password'
    throw err
  }
  localStorage.setItem(SESSION_KEY, u.uid)
  const pub = toPublic(u)
  emit(pub)
  return pub
}

export function localSignOut() {
  localStorage.removeItem(SESSION_KEY)
  emit(null)
}

export function subscribeLocalAuth(fn) {
  listeners.add(fn)
  fn(getSessionUser())
  return () => listeners.delete(fn)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === SESSION_KEY || e.key === USERS_KEY) emit(getSessionUser())
  })
}
