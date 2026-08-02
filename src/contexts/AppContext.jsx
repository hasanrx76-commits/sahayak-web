import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { getSessionUser, subscribeLocalAuth, localSignOut } from '../lib/localAuth'
import { initStorage } from '../data'
import { translations } from '../i18n'

const AppContext = createContext(null)

const LS = {
  theme: 'sahayak_theme',
  lang: 'sahayak_lang',
  voice: 'sahayak_voice',
  gemini: 'sahayak_gemini_key',
}

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readLS(LS.theme, 'dark'))
  const [lang, setLang] = useState(() => readLS(LS.lang, 'en'))
  const [voiceReplies, setVoiceReplies] = useState(() => readLS(LS.voice, true))
  const [geminiKey, setGeminiKey] = useState(() => readLS(LS.gemini, ''))
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(LS.theme, JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    localStorage.setItem(LS.lang, JSON.stringify(lang))
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem(LS.voice, JSON.stringify(voiceReplies))
  }, [voiceReplies])

  useEffect(() => {
    localStorage.setItem(LS.gemini, JSON.stringify(geminiKey))
  }, [geminiKey])

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u)
        setAuthReady(true)
      })
      return unsub
    }
    initStorage().then(() => {
      setUser(getSessionUser())
      setAuthReady(true)
    })
    return subscribeLocalAuth(setUser)
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }, [])

  const t = useCallback((key, langArg) => {
    const dict = translations[langArg || lang]
    return key.split('.').reduce((o, k) => (o ? o[k] : key), dict) || key
  }, [lang])

  const logout = useCallback(async () => {
    if (auth) await signOut(auth)
    else localSignOut()
    setUser(null)
    showToast(t('auth.logout'))
  }, [showToast, t])
  const value = {
    theme,
    setTheme,
    lang,
    setLang,
    voiceReplies,
    setVoiceReplies,
    geminiKey,
    setGeminiKey,
    user,
    authReady,
    showToast,
    toast,
    logout,
    t,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
