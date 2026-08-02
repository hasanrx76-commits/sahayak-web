// Unified data layer: Firebase Firestore when configured + logged in,
// otherwise localStorage (guest mode).

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
  const items = lsRead(kind, uid)
  const item = { id: crypto.randomUUID(), ...data, createdAt: Date.now() }
  items.unshift(item)
  lsWrite(kind, uid, items)
  return item
}

export async function updateItem(kind, uid, id, data) {
  if (firebaseConfigured && uid) {
    return updateDoc(doc(db, 'users', uid, kind, id), { ...data, updatedAt: serverTimestamp() })
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
  lsWrite(kind, uid, lsRead(kind, uid).filter((i) => i.id !== id))
}
