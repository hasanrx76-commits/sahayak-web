// Unified data layer:
//   1. GitHub storage (default, no database) — each signed-in user's
//      notes/todos live in a JSON file in a GitHub repo via api/storage.js.
//   2. Firebase Firestore when configured + logged in.
//   3. localStorage (guest mode / fallback).

import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseConfigured } from './firebase'

// ---- GitHub storage detection ----

let githubEnabled = false
let pingPromise = null

export function initStorage() {
  if (!pingPromise) {
    pingPromise = fetch('/api/storage?action=ping')
      .then((r) => r.json())
      .then((d) => {
        githubEnabled = Boolean(d?.configured)
        return githubEnabled
      })
      .catch(() => {
        githubEnabled = false
        return false
      })
  }
  return pingPromise
}

export function isGitHubUser(uid) {
  return githubEnabled && Boolean(uid) && String(uid).startsWith('local-')
}

// ---- localStorage helpers (fallback / guest) ----

function lsKey(kind, uid) {
  return `sahayak_${kind}_${uid || 'guest'}`
}

function lsRead(kind, uid) {
  try {
    return JSON.parse(localStorage.getItem(lsKey(kind, uid)) || '[]')
  } catch {
    return []
  }
}

function lsWrite(kind, uid, items) {
  localStorage.setItem(lsKey(kind, uid), JSON.stringify(items))
}

// ---- GitHub storage helpers ----

const ghCache = {}

async function ghLoad(uid) {
  if (ghCache[uid]) return ghCache[uid]
  try {
    const res = await fetch(`/api/storage?uid=${encodeURIComponent(uid)}`)
    const all = res.ok ? await res.json() : { todos: [], notes: [] }
    ghCache[uid] = all
    return all
  } catch {
    return { todos: [], notes: [] }
  }
}

async function ghPush(uid, all) {
  ghCache[uid] = all
  try {
    await fetch(`/api/storage?uid=${encodeURIComponent(uid)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(all),
    })
  } catch {
    // Ignore write errors; next refresh will reconcile from the server.
  }
}

function newId() {
  try {
    return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
  } catch {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
  }
}

// ---- Public API ----

// Returns an unsubscribe function.
export function subscribeItems(kind, uid, callback) {
  if (firebaseConfigured && uid) {
    const q = query(
      collection(db, 'users', uid, kind),
      orderBy('createdAt', 'asc'),
    )
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        callback(items)
      },
      (err) => {
        console.error('Firestore subscribe error:', err)
        callback(lsRead(kind, uid))
      },
    )
  }

  if (isGitHubUser(uid)) {
    ghLoad(uid).then((all) => {
      ghCache[uid] = all
      callback(all[kind] || [])
    })
    return () => {}
  }

  callback(lsRead(kind, uid))
  return () => {}
}

export async function addItem(kind, uid, data) {
  if (firebaseConfigured && uid) {
    return addDoc(collection(db, 'users', uid, kind), {
      ...data,
      createdAt: serverTimestamp(),
    })
  }

  if (isGitHubUser(uid)) {
    const all = await ghLoad(uid)
    const item = { id: newId(), ...data, createdAt: Date.now() }
    all[kind] = [item, ...(all[kind] || [])]
    await ghPush(uid, all)
    return item
  }

  const items = lsRead(kind, uid)
  const item = { id: newId(), ...data, createdAt: Date.now() }
  items.unshift(item)
  lsWrite(kind, uid, items)
  return item
}

export async function updateItem(kind, uid, id, data) {
  if (firebaseConfigured && uid) {
    return updateDoc(doc(db, 'users', uid, kind, id), { ...data, updatedAt: serverTimestamp() })
  }

  if (isGitHubUser(uid)) {
    const all = await ghLoad(uid)
    all[kind] = (all[kind] || []).map((i) => (i.id === id ? { ...i, ...data, id } : i))
    await ghPush(uid, all)
    return
  }

  const items = lsRead(kind, uid)
  lsWrite(
    kind,
    uid,
    items.map((i) => (i.id === id ? { ...i, ...data } : i)),
  )
}

export async function removeItem(kind, uid, id) {
  if (firebaseConfigured && uid) {
    return deleteDoc(doc(db, 'users', uid, kind, id))
  }

  if (isGitHubUser(uid)) {
    const all = await ghLoad(uid)
    all[kind] = (all[kind] || []).filter((i) => i.id !== id)
    await ghPush(uid, all)
    return
  }

  lsWrite(kind, uid, lsRead(kind, uid).filter((i) => i.id !== id))
}
