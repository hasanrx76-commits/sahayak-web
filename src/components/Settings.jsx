import { useApp } from '../contexts/AppContext'

export default function Settings({ onClose }) {
  const {
    t, lang, setLang,
    theme, setTheme,
    voiceReplies, setVoiceReplies,
    geminiKey, setGeminiKey,
    user, logout,
  } = useApp()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 20 }}>⚙️ {t('settings.title')}</h3>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="settings-row">
          <div>
            <h4>🌓 {t('settings.theme')}</h4>
            <p>{t('settings.themeD')}</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="settings-row">
          <div>
            <h4>🌐 {t('settings.lang')}</h4>
            <p>{t('settings.langD')}</p>
          </div>
          <div className="tabs">
            <button className={`tab ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`tab ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <h4>🔊 {t('settings.voice')}</h4>
            <p>{t('settings.voiceD')}</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={voiceReplies}
              onChange={(e) => setVoiceReplies(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div>
            <h4>🧠 {t('settings.gemini')}</h4>
            <p>{t('settings.geminiD')}</p>
          </div>
          <input
            className="api-input"
            type="password"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="AIza..."
          />
        </div>

        {user && (
          <button
            className="btn btn-danger"
            style={{ width: '100%', marginTop: 16 }}
            onClick={async () => {
              await logout()
              onClose()
            }}
          >
            🚪 {t('settings.logout')} ({user.displayName || user.email})
          </button>
        )}

        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>
          {t('settings.close')}
        </button>
      </div>
    </div>
  )
}
