import { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'

export default function Navbar({ view, setView, onOpenSettings }) {
  const { t, theme, setTheme, user } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { key: 'home', label: t('nav.home') },
    { key: 'features', label: t('nav.features') },
    { key: 'assistant', label: t('nav.assistant') },
    ...(user ? [{ key: 'dashboard', label: t('nav.dashboard') }] : []),
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
        <span className="logo-icon">🤖</span>
        <span>Sahayak</span>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.key}
            className={`nav-link ${view === l.key ? 'active' : ''}`}
            onClick={() => {
              setView(l.key)
              document.getElementById(l.key)?.scrollIntoView({ behavior: 'smooth' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            {l.label}
          </button>
        ))}
        <button className="btn-icon" title={t('common.settings')} onClick={onOpenSettings}>
          ⚙️
        </button>
        <button
          className="btn-icon"
          title="Theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {!user && (
          <button
            className="btn btn-primary hide-mobile"
            style={{ padding: '9px 18px', fontSize: '14px' }}
            onClick={() => setView('login')}
          >
            {t('auth.loginBtn')}
          </button>
        )}
      </div>
    </nav>
  )
}
