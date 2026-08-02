import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { auth, googleProvider } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'

export default function Auth({ setView }) {
  const { t, lang, user, showToast } = useApp()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return (
      <section className="section" style={{ paddingTop: 130, minHeight: '70vh' }}>
        <div className="container">
          <div className="auth-wrap">
            <div className="card auth-card">
              <div className="auth-title">👋 {t('dash.welcome')}, {user.displayName || user.email}!</div>
              <div className="auth-sub">{t('auth.loginOk')}</div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setView('dashboard')}>
                📊 {t('nav.dashboard')}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('auth.errEmail'))
      return false
    }
    if (password.length < 6) {
      setError(t('auth.errPass'))
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        showToast(t('auth.loginOk'))
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) await updateProfile(cred.user, { displayName: name })
        showToast(t('auth.welcome'))
      }
    } catch (err) {
      setError(friendlyError(err, lang))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      showToast(t('auth.loginOk'))
    } catch (err) {
      setError(friendlyError(err, lang))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section" style={{ paddingTop: 130, minHeight: '70vh' }}>
      <div className="container">
        <div className="auth-wrap">
          <div className="card auth-card">
            <div className="auth-title">{mode === 'login' ? t('auth.login') : t('auth.signup')}</div>
            <div className="auth-sub">{mode === 'login' ? t('auth.loginSub') : t('auth.signupSub')}</div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="field">
                  <label>{t('auth.name')}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="field">
                <label>{t('auth.email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="field">
                <label>{t('auth.password')}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? '...' : mode === 'login' ? t('auth.loginBtn') : t('auth.signupBtn')}
              </button>
            </form>

            {googleProvider && (
              <>
                <div style={{ textAlign: 'center', margin: '18px 0', color: 'var(--text-dim)', fontSize: 13 }}>
                  — or —
                </div>
                <button className="btn btn-ghost provider-row" style={{ width: '100%' }} onClick={handleGoogle} disabled={loading}>
                  <span style={{ fontSize: 18 }}>🟢</span> {t('auth.google')}
                </button>
              </>
            )}

            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={() => setView('home')}>
              👤 {t('auth.guest')}
            </button>

            <div className="auth-switch">
              {mode === 'login' ? t('auth.toSignup') : t('auth.toLogin')}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
                {mode === 'login' ? t('auth.signupLink') : t('auth.loginLink')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function friendlyError(err, lang) {
  const code = err?.code || ''
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return lang === 'hi' ? 'गलत ईमेल या पासवर्ड।' : 'Wrong email or password.'
  }
  if (code.includes('email-already-in-use')) {
    return lang === 'hi' ? 'यह ईमेल पहले से इस्तेमाल हो रहा है।' : 'This email is already registered.'
  }
  if (code.includes('network')) {
    return lang === 'hi' ? 'इंटरनेट कनेक्शन जांचें।' : 'Check your internet connection.'
  }
  return err?.message || (lang === 'hi' ? 'कुछ गड़बड़ हो गई।' : 'Something went wrong.')
}
