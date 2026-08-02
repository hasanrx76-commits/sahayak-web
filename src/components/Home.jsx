import { useApp } from '../contexts/AppContext'
import { usePwaInstall } from '../hooks/usePwaInstall'

const featureIcons = ['🎙️', '🧠', '🌍', '📝', '✅', '🔒', '🌓', '🌐', '📲', '🧰', '🧮', '💱', '🌦', '📖', '🎯', '🍽', '⚖️', '🔠', '🎲', '📅', '🧱', '🏗️', '🪣', '🗺️', '🎛️', '⚡', '🔩', '🔌', '🔥', '💪', '💧', '❤️', '🏦', '📈', '🧾', '💹', '💯', '🎂', '📆', '⛽', '🎓', '📊', '➗', '🔢', '🏛️', '🔤', '📐', '🍕', '👩‍🍳', '🌡️', '🥄', '🍚', '🕐', '🧭', '💼', '🚗', '📦', '💰', '🏷️', '⚖️', '🎯', '💵', '🔎', '🤝', '💳', '🥗', '🏋️', '🏃', '👟', '⏳', '🧮', '💽', '🎨', '🔣', '🅱️', '🔗', '📄', '🕸️', '💾', '🌱', '🌾', '🧪', '🚜', '🥁', '🎵', '🎼', '🎶', '💡', '🧊', '😴']

export default function Home({ setView, onOpenDashboard, onOpenTools }) {
  const { t, lang, setLang, theme, setTheme, showToast } = useApp()
  const { promptInstall } = usePwaInstall()

  const openChat = () => window.dispatchEvent(new CustomEvent('sahayak-open-chat'))

  const installApp = async () => {
    const ok = await promptInstall()
    if (!ok) {
      showToast(lang === 'hi' ? 'ब्राउज़र के मेन्यू से "Install" करें।' : 'Install from your browser menu instead.')
    }
  }

  const openTools = (tool) => {
    if (onOpenTools) onOpenTools(tool)
    else setView('tools')
  }

  const actions = [
    () => setView('assistant'),
    openChat,
    () => showToast(lang === 'hi' ? '✨ 3D बैकग्राउंड पहले से एक्टिव है!' : '✨ The 3D background is already active!'),
    () => onOpenDashboard('notes'),
    () => onOpenDashboard('todos'),
    () => setView('login'),
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    () => setLang(lang === 'en' ? 'hi' : 'en'),
    installApp,
    () => openTools('converter'),
    () => openTools('calculator'),
    () => openTools('currency'),
    () => openTools('weather'),
    () => openTools('dictionary'),
    () => openTools('pomodoro'),
    () => openTools('tip'),
    () => openTools('bmi'),
    () => openTools('case'),
    () => openTools('random'),
    () => openTools('datetime'),
    () => openTools('brick'),
    () => openTools('concrete'),
    () => openTools('paint'),
    () => openTools('land'),
    () => openTools('resistor'),
    () => openTools('ohm'),
    () => openTools('steel'),
    () => openTools('power'),
    () => openTools('bmr'),
    () => openTools('idealwt'),
    () => openTools('water'),
    () => openTools('heartrate'),
    () => openTools('emi'),
    () => openTools('sip'),
    () => openTools('gst'),
    () => openTools('interest'),
    () => openTools('percent'),
    () => openTools('age'),
    () => openTools('datediff'),
    () => openTools('fuel'),
    () => openTools('gpa'),
    () => openTools('stat'),
    () => openTools('lcmhcf'),
    () => openTools('prime'),
    () => openTools('roman'),
    () => openTools('words'),
    () => openTools('quad'),
    () => openTools('fraction'),
    () => openTools('recipe'),
    () => openTools('oven'),
    () => openTools('measure'),
    () => openTools('rice'),
    () => openTools('timezone'),
    () => openTools('distance'),
    () => openTools('budget'),
    () => openTools('speed'),
    () => openTools('volume'),
    () => openTools('profit'),
    () => openTools('markup'),
    () => openTools('breakeven'),
    () => openTools('roi'),
    () => openTools('change'),
    () => openTools('unitprice'),
    () => openTools('commission'),
    () => openTools('billsplit'),
    () => openTools('macros'),
    () => openTools('onerm'),
    () => openTools('pace'),
    () => openTools('steps'),
    () => openTools('deficit'),
    () => openTools('bodyfat'),
    () => openTools('baseconv'),
    () => openTools('hexrgb'),
    () => openTools('ascii'),
    () => openTools('base64'),
    () => openTools('urlcode'),
    () => openTools('jsonfmt'),
    () => openTools('subnet'),
    () => openTools('storage'),
    () => openTools('seed'),
    () => openTools('fertilizer'),
    () => openTools('pesticide'),
    () => openTools('yield'),
    () => openTools('metronome'),
    () => openTools('bpmms'),
    () => openTools('notefreq'),
    () => openTools('interval'),
    () => openTools('electricity'),
    () => openTools('appliance'),
    () => openTools('sleep'),
  ]

  const features = []
  for (let i = 1; i <= 90; i++) {
    features.push({
      icon: featureIcons[i - 1],
      title: t(`features.f${i}t`),
      desc: t(`features.f${i}d`),
      onClick: actions[i - 1],
    })
  }

  return (
    <>
      <section className="hero" id="home">
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
              <div key={i} className="card feature-card" onClick={f.onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && f.onClick()}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-go">Open →</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
