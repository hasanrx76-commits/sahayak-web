import { useApp } from '../contexts/AppContext'

export default function Footer({ setView }) {
  const { t } = useApp()
  return (
    <footer className="footer">
      <div className="container">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setView('home')}>
          <span className="logo-icon">🤖</span>
          <span>Sahayak</span>
        </div>
        <p style={{ marginBottom: 10 }}>{t('common.footer')}</p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>{t('common.copy')}</p>
      </div>
    </footer>
  )
}
