import { useEffect, useRef, useState } from 'react'
import { useApp } from '../contexts/AppContext'

const S = {
  en: {
    title: 'Mini Tools',
    sub: 'Handy tools that work instantly — no internet needed.',
    unit: 'Unit Converter',
    unitFrom: 'From',
    unitTo: 'To',
    length: 'Length',
    weight: 'Weight',
    temp: 'Temperature',
    pass: 'Password Generator',
    passLen: 'Length',
    passGen: 'Generate',
    passCopy: 'Copied!',
    text: 'Text Counter',
    textPh: 'Type or paste text here...',
    words: 'words',
    chars: 'characters',
    letters: 'letters (no spaces)',
    lines: 'lines',
    stopwatch: 'Stopwatch',
    start: 'Start',
    stop: 'Stop',
    reset: 'Reset',
    quotes: 'Quote of the Day',
    qMore: 'Another one',
    units: {
      length: { km: 'Kilometer', m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', mi: 'Mile', yd: 'Yard', ft: 'Foot', in: 'Inch' },
      weight: { kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce', t: 'Metric Ton' },
      temp: { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' },
    },
  },
  hi: {
    title: 'मिनी टूल्स',
    sub: 'आसान उपकरण जो तुरंत काम करते हैं — इंटरनेट की जरूरत नहीं।',
    unit: 'यूनिट कन्वर्टर',
    unitFrom: 'से',
    unitTo: 'में',
    length: 'लंबाई',
    weight: 'वज़न',
    temp: 'तापमान',
    pass: 'पासवर्ड जनरेटर',
    passLen: 'लंबाई',
    passGen: 'बनाएं',
    passCopy: 'कॉपी हो गया!',
    text: 'टेक्स्ट काउंटर',
    textPh: 'यहां टाइप करें या टेक्स्ट पेस्ट करें...',
    words: 'शब्द',
    chars: 'अक्षर',
    letters: 'अक्षर (बिना स्पेस)',
    lines: 'लाइनें',
    stopwatch: 'स्टॉपवॉच',
    start: 'शुरू',
    stop: 'रोकें',
    reset: 'रीसेट',
    quotes: 'आज की प्रेरणा',
    qMore: 'एक और',
    units: {
      length: { km: 'किलोमीटर', m: 'मीटर', cm: 'सेंटीमीटर', mm: 'मिलीमीटर', mi: 'मील', yd: 'गज', ft: 'फुट', in: 'इंच' },
      weight: { kg: 'किलोग्राम', g: 'ग्राम', mg: 'मिलीग्राम', lb: 'पाउंड', oz: 'औंस', t: 'मीट्रिक टन' },
      temp: { c: 'सेल्सियस', f: 'फ़ारेनहाइट', k: 'केल्विन' },
    },
  },
}

const QUOTES_EN = [
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Believe you can and you are halfway there. — Theodore Roosevelt',
  'It does not matter how slowly you go as long as you do not stop. — Confucius',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill',
  'Do what you can, with what you have, where you are. — Theodore Roosevelt',
  'The future depends on what you do today. — Mahatma Gandhi',
]
const QUOTES_HI = [
  'पेड़ लगाने का सबसे अच्छा समय 20 साल पहले था। दूसरा सबसे अच्छा समय अभी है।',
  'विश्वास रखो, तुम आधे रास्ते पहुँच चुके हो।',
  'भले ही आप धीरे चलें, लेकिन रुकिए मत। — कन्फ्यूशियस',
  'सफलता अंतिम नहीं, असफलता घातक नहीं: जो मायने रखता है वह आगे बढ़ते रहने का साहस है। — विंस्टन चर्चिल',
  'भविष्य इस बात पर निर्भर करता है कि आप आज क्या करते हैं। — महात्मा गांधी',
]

// Conversion factors to a base unit (meters, kg, celsius-free temp table).
const FACTORS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523, t: 1000 },
}

function convert(value, kind, from, to) {
  if (kind === 'temp') {
    let c
    if (from === 'c') c = value
    else if (from === 'f') c = (value - 32) * (5 / 9)
    else c = value - 273.15
    let out
    if (to === 'c') out = c
    else if (to === 'f') out = c * (9 / 5) + 32
    else out = c + 273.15
    return out
  }
  return (value * FACTORS[kind][from]) / FACTORS[kind][to]
}

function UnitConverter({ s }) {
  const [kind, setKind] = useState('length')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('km')
  const units = Object.keys(FACTORS[kind] || {})
  const list = kind === 'temp' ? ['c', 'f', 'k'] : units

  const switchKind = (k) => {
    setKind(k)
    const l = k === 'temp' ? ['c', 'f', 'k'] : Object.keys(FACTORS[k])
    setFrom(l[0])
    setTo(l[1])
  }

  const num = parseFloat(value)
  const result = isNaN(num) ? '' : convert(num, kind, from, to)

  return (
    <div className="card tool-card">
      <h3>📐 {s.unit}</h3>
      <div className="tabs" style={{ margin: '12px 0' }}>
        {['length', 'weight', 'temp'].map((k) => (
          <button key={k} className={`tab ${kind === k ? 'active' : ''}`} onClick={() => switchKind(k)}>
            {k === 'length' ? s.length : k === 'weight' ? s.weight : s.temp}
          </button>
        ))}
      </div>
      <div className="tool-grid">
        <label className="field">
          <span>{s.unitFrom}</span>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className="field">
          <span>{s.unitTo}</span>
          <input type="number" readOnly value={isNaN(result) ? '' : +result.toFixed(6)} />
        </label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {list.map((u) => (
            <option key={u} value={u}>{s.units[kind][u]}</option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {list.map((u) => (
            <option key={u} value={u}>{s.units[kind][u]}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function PasswordGen({ s }) {
  const [len, setLen] = useState(16)
  const [pw, setPw] = useState('')
  const [copied, setCopied] = useState(false)
  const gen = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-='
    let out = ''
    const arr = new Uint32Array(len)
    crypto.getRandomValues(arr)
    for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length]
    setPw(out)
    setCopied(false)
  }
  const copy = async () => {
    if (!pw) return
    try {
      await navigator.clipboard.writeText(pw)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="card tool-card">
      <h3>🔐 {s.pass}</h3>
      <div className="pw-row">
        <input readOnly value={pw} placeholder="••••••••" style={{ fontFamily: 'monospace' }} />
        <button className="btn btn-primary" onClick={gen}>{s.passGen}</button>
      </div>
      <div className="pw-controls">
        <label className="field" style={{ maxWidth: 160 }}>
          <span>{s.passLen}: {len}</span>
          <input type="range" min="6" max="40" value={len} onChange={(e) => setLen(+e.target.value)} />
        </label>
        <button className="btn btn-ghost" onClick={copy} disabled={!pw}>
          {copied ? '✅ ' + s.passCopy : '📋'}
        </button>
      </div>
    </div>
  )
}

function TextCounter({ s }) {
  const [text, setText] = useState('')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const letters = text.replace(/\s/g, '').length
  const lines = text ? text.split('\n').length : 0
  return (
    <div className="card tool-card">
      <h3>✍️ {s.text}</h3>
      <textarea rows={4} placeholder={s.textPh} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="counter-stats">
        <div><b>{words}</b><span>{s.words}</span></div>
        <div><b>{chars}</b><span>{s.chars}</span></div>
        <div><b>{letters}</b><span>{s.letters}</span></div>
        <div><b>{lines}</b><span>{s.lines}</span></div>
      </div>
    </div>
  )
}

function Stopwatch({ s }) {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => setMs((m) => m + 97), 97)
    return () => clearInterval(ref.current)
  }, [running])
  const fmt = (m) => {
    const min = Math.floor(m / 60000)
    const sec = Math.floor((m % 60000) / 1000)
    const cs = Math.floor((m % 1000) / 10)
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }
  return (
    <div className="card tool-card stopwatch-card">
      <h3>⏱️ {s.stopwatch}</h3>
      <div className="time-display">{fmt(ms)}</div>
      <div className="tool-actions">
        <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={() => setRunning(!running)}>
          {running ? '⏸ ' + s.stop : '▶ ' + s.start}
        </button>
        <button className="btn btn-ghost" onClick={() => { setRunning(false); setMs(0) }}>
          {s.reset}
        </button>
      </div>
    </div>
  )
}

function QuoteBox({ s, lang }) {
  const quotes = lang === 'hi' ? QUOTES_HI : QUOTES_EN
  const [q, setQ] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  return (
    <div className="card tool-card quote-card">
      <h3>💬 {s.quotes}</h3>
      <p className="quote-text">“{q}”</p>
      <button className="btn btn-ghost" onClick={() => setQ(quotes[Math.floor(Math.random() * quotes.length)])}>
        🔄 {s.qMore}
      </button>
    </div>
  )
}

export default function Tools() {
  const { lang } = useApp()
  const s = S[lang] || S.en
  return (
    <section className="section" style={{ paddingTop: 110, minHeight: '75vh' }}>
      <div className="container">
        <h2 className="section-title">🧰 {s.title}</h2>
        <p className="section-sub">{s.sub}</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <UnitConverter s={s} />
          <PasswordGen s={s} />
          <TextCounter s={s} />
          <Stopwatch s={s} />
          <QuoteBox s={s} lang={lang} />
        </div>
      </div>
    </section>
  )
}
