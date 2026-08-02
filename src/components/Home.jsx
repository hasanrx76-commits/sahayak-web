import { Suspense, lazy } from 'react'
import { useApp } from '../contexts/AppContext'

const Scene3D = lazy(() => import('./Scene3D'))

const featureIcons = ['🎙️', '🧠', '🌍', '📝', '✅', '🔒', '🌓', '🌐', '📲']

export default function Home({ setView }) {
  const { t } = useApp()
  const features = []
  for (let i = 1; i <= 9; i++) {
    features.push({
      icon: featureIcons[i - 1],
      title: t(`features.f${i}t`),
      desc: t(`features.f${i}d`),
    })
  }

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-canvas">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </div>
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content">
            <span className="badge">⚡ {t('hero.badge')}</span>
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-sub">{t('hero.sub')}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setView('assistant')}>
                🎙️ {t('hero.cta')}
              </button>
              <button className="btn btn-ghost" onClick={() => setView('features')}>
                ✨ {t('hero.cta2')}
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-value">3D</div>
                <div className="stat-label">{t('hero.stats1')}</div>
              </div>
              <div>
                <div className="stat-value">🎤</div>
                <div className="stat-label">{t('hero.stats2')}</div>
              </div>
              <div>
                <div className="stat-value">🔐</div>
                <div className="stat-label">{t('hero.stats3')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features" style={{ paddingTop: 40 }}>
        <div className="container">
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-sub">{t('features.sub')}</p>
          <div className="grid">
            {features.map((f, i) => (
              <div key={i} className="card feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
