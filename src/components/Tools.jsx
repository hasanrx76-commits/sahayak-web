import { useEffect, useRef, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { PRO_CATEGORIES, PRO_RENDER, PRO_TAB, PRO_STRINGS } from './proTools'
import { P2_CATEGORIES, P2_RENDER, P2_TAB, P2_STRINGS } from './proTools2'
import { P3_CATEGORIES, P3_RENDER, P3_TAB, P3_STRINGS } from './proTools3'

const S = {
  en: {
    title: 'Mini Tools',
    sub: 'A full toolbox that works instantly — most tools work even offline.',
    copy: 'Copied!',
    tabs: {
      converter: 'Converter',
      calculator: 'Calculator',
      currency: 'Currency',
      weather: 'Weather',
      dictionary: 'Dictionary',
      pomodoro: 'Pomodoro',
      tip: 'Tip Split',
      bmi: 'BMI',
      case: 'Case',
      random: 'Random',
      datetime: 'Date & Time',
      password: 'Password',
      counter: 'Text Count',
      stopwatch: 'Stopwatch',
      quote: 'Quotes',
    },
    converter: { title: 'Unit Converter', from: 'From', to: 'To', length: 'Length', weight: 'Weight', temp: 'Temperature' },
    calculator: { title: 'Calculator', c: 'C', bksp: '⌫', eq: '=' },
    currency: { title: 'Currency Converter', amt: 'Amount', from: 'From', to: 'To', live: 'Live rates via open.er-api.com', err: 'Could not fetch rates. Check your internet and try again.', loading: 'Loading rates…' },
    weather: { title: 'Weather', city: 'City name', check: 'Check', loading: 'Loading weather…', err: 'City not found. Check the spelling.', feels: 'Wind', hum: 'Humidity', ws: 'km/h' },
    dictionary: { title: 'Dictionary', word: 'Enter a word', look: 'Look up', loading: 'Searching…', err: 'Word not found. Check the spelling.', no: 'No definition found.' },
    pomodoro: { title: 'Pomodoro Timer', focus: 'Focus', short: 'Break', long: 'Long break', start: 'Start', pause: 'Pause', reset: 'Reset', sessions: 'sessions', focusMin: 'Focus', breakMin: 'Break' },
    tip: { title: 'Tip Splitter', bill: 'Bill amount', tip: 'Tip %', people: 'People', perPerson: 'per person' },
    bmi: { title: 'BMI Calculator', height: 'Height (cm)', weight: 'Weight (kg)', calc: 'Calculate', result: 'Your BMI', tips: { under: 'Underweight', normal: 'Normal weight', over: 'Overweight', obese: 'Obese' } },
    case: { title: 'Case Converter', ph: 'Type or paste text here…', upper: 'UPPER', lower: 'lower', tcase: 'Title Case', capital: 'Sentence' },
    random: { title: 'Random Generator', num: 'Random number', min: 'Min', max: 'Max', roll: 'Roll', coin: 'Coin flip', dice: 'Dice', color: 'Random color', pick: 'Pick a name', name: 'Names (comma separated)' },
    datetime: { title: 'Date & Time', dayOfYear: 'Day of year', daysLeft: 'days left in', today: 'Today is' },
    password: { title: 'Password Generator', len: 'Length', gen: 'Generate' },
    counter: { title: 'Text Counter', ph: 'Type or paste text here…', words: 'words', chars: 'characters', letters: 'letters', lines: 'lines' },
    stopwatch: { title: 'Stopwatch', start: 'Start', stop: 'Stop', reset: 'Reset' },
    quote: { title: 'Quote of the Day', more: 'Another one' },
    units: {
      length: { km: 'Kilometer', m: 'Meter', cm: 'Centimeter', mm: 'Millimeter', mi: 'Mile', yd: 'Yard', ft: 'Foot', in: 'Inch' },
      weight: { kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce', t: 'Metric Ton' },
      temp: { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' },
    },
  },
  hi: {
    title: 'मिनी टूल्स',
    sub: 'पूरा टूलबॉक्स जो तुरंत काम करता है — ज़्यादातर टूल ऑफ़लाइन भी चलते हैं।',
    copy: 'कॉपी हो गया!',
    tabs: {
      converter: 'कन्वर्टर',
      calculator: 'कैलकुलेटर',
      currency: 'मुद्रा',
      weather: 'मौसम',
      dictionary: 'डिक्शनरी',
      pomodoro: 'पोमोडोरो',
      tip: 'टिप बांटें',
      bmi: 'BMI',
      case: 'केस',
      random: 'रैंडम',
      datetime: 'दिनांक',
      password: 'पासवर्ड',
      counter: 'टेक्स्ट',
      stopwatch: 'स्टॉपवॉच',
      quote: 'प्रेरणा',
    },
    converter: { title: 'यूनिट कन्वर्टर', from: 'से', to: 'में', length: 'लंबाई', weight: 'वज़न', temp: 'तापमान' },
    calculator: { title: 'कैलकुलेटर', c: 'सी', bksp: '⌫', eq: '=' },
    currency: { title: 'करेंसी कन्वर्टर', amt: 'राशि', from: 'से', to: 'में', live: 'लाइव दरें open.er-api.com से', err: 'दरें लोड नहीं हुईं। इंटरनेट जांचें।', loading: 'दरें लोड हो रही हैं…' },
    weather: { title: 'मौसम', city: 'शहर का नाम', check: 'देखें', loading: 'मौसम लोड हो रहा है…', err: 'शहर नहीं मिला। स्पेलिंग जांचें।', feels: 'हवा', hum: 'नमी', ws: 'किमी/घं' },
    dictionary: { title: 'डिक्शनरी', word: 'शब्द लिखें', look: 'ढूंढें', loading: 'खोज रहे हैं…', err: 'शब्द नहीं मिला। स्पेलिंग जांचें।', no: 'कोई अर्थ नहीं मिला।' },
    pomodoro: { title: 'पोमोडोरो टाइमर', focus: 'फोकस', short: 'ब्रेक', long: 'लंबा ब्रेक', start: 'शुरू', pause: 'रोकें', reset: 'रीसेट', sessions: 'सेशन', focusMin: 'फोकस', breakMin: 'ब्रेक' },
    tip: { title: 'टिप स्प्लिटर', bill: 'बिल राशि', tip: 'टिप %', people: 'लोग', perPerson: 'प्रति व्यक्ति' },
    bmi: { title: 'BMI कैलकुलेटर', height: 'लंबाई (सेमी)', weight: 'वज़न (किलो)', calc: 'गणना करें', result: 'आपका BMI', tips: { under: 'कम वज़न', normal: 'सामान्य', over: 'ज़्यादा वज़न', obese: 'मोटापा' } },
    case: { title: 'केस कन्वर्टर', ph: 'यहां टाइप करें…', upper: 'UPPER', lower: 'lower', tcase: 'Title Case', capital: 'वाक्य' },
    random: { title: 'रैंडम जनरेटर', num: 'रैंडम नंबर', min: 'न्यूनतम', max: 'अधिकतम', roll: 'चुनें', coin: 'सिक्का', dice: 'पासा', color: 'रैंडम रंग', pick: 'नाम चुनें', name: 'नाम (कॉमा से अलग)' },
    datetime: { title: 'दिनांक और समय', dayOfYear: 'साल का दिन', daysLeft: 'साल में बाकी दिन', today: 'आज है' },
    password: { title: 'पासवर्ड जनरेटर', len: 'लंबाई', gen: 'बनाएं' },
    counter: { title: 'टेक्स्ट काउंटर', ph: 'यहां टाइप करें…', words: 'शब्द', chars: 'अक्षर', letters: 'अक्षर (बिना स्पेस)', lines: 'लाइनें' },
    stopwatch: { title: 'स्टॉपवॉच', start: 'शुरू', stop: 'रोकें', reset: 'रीसेट' },
    quote: { title: 'आज की प्रेरणा', more: 'एक और' },
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

const CURRENCIES = [
  ['USD', 'US Dollar'], ['EUR', 'Euro'], ['INR', 'Indian Rupee'], ['GBP', 'British Pound'], ['JPY', 'Japanese Yen'], ['CNY', 'Chinese Yuan'], ['AUD', 'Australian Dollar'], ['CAD', 'Canadian Dollar'], ['CHF', 'Swiss Franc'], ['AED', 'UAE Dirham'], ['BRL', 'Brazilian Real'], ['MXN', 'Mexican Peso'], ['RUB', 'Russian Ruble'], ['SGD', 'Singapore Dollar'], ['HKD', 'Hong Kong Dollar'], ['ZAR', 'South African Rand'], ['SAR', 'Saudi Riyal'], ['TRY', 'Turkish Lira'], ['PKR', 'Pakistani Rupee'], ['BDT', 'Bangladeshi Taka'], ['LKR', 'Sri Lankan Rupee'], ['NPR', 'Nepalese Rupee'],
]

const FACTORS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523, t: 1000 },
}

const fmt = (n, d = 6) => (isNaN(n) ? '' : +Number(n).toFixed(d))

function convert(value, kind, from, to) {
  if (kind === 'temp') {
    let c = from === 'c' ? value : from === 'f' ? (value - 32) * (5 / 9) : value - 273.15
    const out = to === 'c' ? c : to === 'f' ? c * (9 / 5) + 32 : c + 273.15
    return out
  }
  return (value * FACTORS[kind][from]) / FACTORS[kind][to]
}

// ---------- Tools ----------

function UnitConverter({ s }) {
  const [kind, setKind] = useState('length')
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('m')
  const [to, setTo] = useState('km')
  const list = kind === 'temp' ? ['c', 'f', 'k'] : Object.keys(FACTORS[kind])
  const switchKind = (k) => {
    setKind(k)
    const l = k === 'temp' ? ['c', 'f', 'k'] : Object.keys(FACTORS[k])
    setFrom(l[0])
    setTo(l[1])
  }
  const result = fmt(convert(parseFloat(value), kind, from, to))
  return (
    <div className="card tool-card">
      <h3>📐 {s.converter.title}</h3>
      <div className="tabs" style={{ margin: '12px 0' }}>
        {['length', 'weight', 'temp'].map((k) => (
          <button key={k} className={`tab ${kind === k ? 'active' : ''}`} onClick={() => switchKind(k)}>
            {k === 'length' ? s.converter.length : k === 'weight' ? s.converter.weight : s.converter.temp}
          </button>
        ))}
      </div>
      <div className="tool-grid">
        <label className="field"><span>{s.converter.from}</span><input type="number" value={value} onChange={(e) => setValue(e.target.value)} /></label>
        <label className="field"><span>{s.converter.to}</span><input type="number" readOnly value={result} /></label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>{list.map((u) => <option key={u} value={u}>{s.units[kind][u]}</option>)}</select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>{list.map((u) => <option key={u} value={u}>{s.units[kind][u]}</option>)}</select>
      </div>
    </div>
  )
}

function Calculator({ s }) {
  const [disp, setDisp] = useState('0')
  const [acc, setAcc] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(true)
  const calc = (a, b, o) => {
    const x = parseFloat(a)
    const y = parseFloat(b)
    if (o === '+') return x + y
    if (o === '-') return x - y
    if (o === '×') return x * y
    if (o === '÷') return y === 0 ? 'Error' : x / y
    return y
  }
  const press = (k) => {
    if (k === 'C') { setDisp('0'); setAcc(null); setOp(null); setFresh(true); return }
    if (k === '⌫') { if (!fresh) setDisp((d) => (d.length > 1 ? d.slice(0, -1) : '0')); return }
    if (['+', '-', '×', '÷'].includes(k)) {
      if (acc !== null && !fresh) { setAcc(String(calc(acc, disp, op))) }
      else if (acc === null) setAcc(disp)
      setOp(k)
      setFresh(true)
      return
    }
    if (k === '=') {
      if (acc !== null && op) { setDisp(String(calc(acc, disp, op))); setAcc(null); setOp(null); setFresh(true) }
      return
    }
    if (k === '.') {
      if (fresh) { setDisp('0.'); setFresh(false); return }
      if (!disp.includes('.')) setDisp(disp + '.')
      return
    }
    setDisp(fresh ? k : disp + k)
    setFresh(false)
  }
  const buttons = ['C', '⌫', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '.', '0']
  return (
    <div className="card tool-card">
      <h3>🧮 {s.calculator.title}</h3>
      <div className="calc-display">{disp}</div>
      <div className="calc-grid">
        {buttons.map((b, i) => (
          <button key={i} className={`calc-btn ${b === '=' ? 'accent' : ''}`} onClick={() => press(b)}>{b}</button>
        ))}
      </div>
    </div>
  )
}

function CurrencyConverter({ s }) {
  const [amt, setAmt] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [rates, setRates] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    let alive = true
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((d) => { if (alive) setRates(d.rates || null) })
      .catch(() => { if (alive) setErr(s.currency.err) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const result = rates ? fmt((parseFloat(amt) / rates[from]) * rates[to], 4) : ''
  return (
    <div className="card tool-card">
      <h3>💱 {s.currency.title}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{s.currency.live}</p>
      <div className="tool-grid">
        <label className="field"><span>{s.currency.amt}</span><input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
        <label className="field"><span>{s.currency.to}</span><input type="number" readOnly value={result} /></label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>{CURRENCIES.map(([c, n]) => <option key={c} value={c}>{c} — {n}</option>)}</select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>{CURRENCIES.map(([c, n]) => <option key={c} value={c}>{c} — {n}</option>)}</select>
      </div>
      {!rates && !err && <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 10 }}>{s.currency.loading}</p>}
      {err && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 10 }}>{err}</p>}
    </div>
  )
}

const WMO = {
  0: '☀️ Clear', 1: '🌤 Mostly clear', 2: '⛅ Partly cloudy', 3: '☁️ Overcast', 45: '🌫 Foggy', 48: '🌫 Rime fog', 51: '🌦 Light drizzle', 53: '🌧 Drizzle', 55: '🌧 Heavy drizzle', 61: '🌧 Light rain', 63: '🌧 Rain', 65: '🌧 Heavy rain', 71: '🌨 Light snow', 73: '🌨 Snow', 75: '❄️ Heavy snow', 80: '🌦 Showers', 81: '🌧 Showers', 82: '⛈ Heavy showers', 95: '⛈ Thunderstorm', 96: '⛈ Thunderstorm + hail', 99: '⛈ Severe thunderstorm',
}

function Weather({ s }) {
  const [city, setCity] = useState('Delhi')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const check = async () => {
    setErr('')
    setData(null)
    setLoading(true)
    try {
      const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).json()
      const place = g?.results?.[0]
      if (!place) throw new Error('nf')
      const w = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`)).json()
      setData({ place, current: w.current })
    } catch {
      setErr(s.weather.err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { check(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="card tool-card">
      <h3>🌦 {s.weather.title}</h3>
      <div className="pw-row">
        <input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check()} placeholder={s.weather.city} />
        <button className="btn btn-primary" onClick={check}>{s.weather.check}</button>
      </div>
      {loading && <p style={{ color: 'var(--text-dim)', marginTop: 12 }}>{s.weather.loading}</p>}
      {err && <p style={{ color: 'var(--danger)', marginTop: 12 }}>{err}</p>}
      {data && (
        <div className="weather-result">
          <div className="weather-main">
            <div style={{ fontSize: 40 }}>{WMO[data.current.weather_code] || '🌡️'}</div>
            <div>
              <b style={{ fontSize: 26 }}>{data.current.temperature_2m}°C</b>
              <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>{data.place.name}{data.place.country ? ', ' + data.place.country : ''}</div>
            </div>
          </div>
          <div className="counter-stats">
            <div><b>{data.current.wind_speed_10m}</b><span>{s.weather.feels} ({s.weather.ws})</span></div>
            <div><b>{data.current.relative_humidity_2m}%</b><span>{s.weather.hum}</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

function Dictionary({ s }) {
  const [word, setWord] = useState('')
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const look = async () => {
    if (!word.trim()) return
    setErr('')
    setEntry(null)
    setLoading(true)
    try {
      const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`)
      if (!r.ok) throw new Error('nf')
      const d = await r.json()
      const first = d[0]
      setEntry({
        word: first.word,
        phonetic: first.phonetic || '',
        meanings: (first.meanings || []).map((m) => ({
          pos: m.partOfSpeech,
          defs: (m.definitions || []).slice(0, 2).map((x) => x.definition),
        })),
      })
    } catch {
      setErr(s.dictionary.err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="card tool-card">
      <h3>📖 {s.dictionary.title}</h3>
      <div className="pw-row">
        <input value={word} onChange={(e) => setWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && look()} placeholder={s.dictionary.word} />
        <button className="btn btn-primary" onClick={look}>{s.dictionary.look}</button>
      </div>
      {loading && <p style={{ color: 'var(--text-dim)', marginTop: 12 }}>{s.dictionary.loading}</p>}
      {err && <p style={{ color: 'var(--danger)', marginTop: 12 }}>{err}</p>}
      {entry && (
        <div style={{ marginTop: 12 }}>
          <h4 style={{ fontSize: 18 }}>{entry.word} {entry.phonetic && <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>{entry.phonetic}</span>}</h4>
          {entry.meanings.map((m, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <i style={{ color: 'var(--accent)' }}>{m.pos}</i>
              <ul style={{ paddingLeft: 18, marginTop: 4, fontSize: 14, lineHeight: 1.5 }}>
                {m.defs.map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Pomodoro({ s }) {
  const [mode, setMode] = useState('focus')
  const [left, setLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(ref.current)
          setRunning(false)
          if (mode === 'focus') {
            setSessions((x) => x + 1)
            setMode('short')
            setLeft(5 * 60)
          } else {
            setMode('focus')
            setLeft(25 * 60)
          }
          try {
            if (navigator.vibrate) navigator.vibrate(500)
          } catch {}
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running, mode])
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <div className="card tool-card stopwatch-card">
      <h3>🎯 {s.pomodoro.title}</h3>
      <div className="tabs" style={{ justifyContent: 'center', margin: '10px 0' }}>
        <button className={`tab ${mode === 'focus' ? 'active' : ''}`} onClick={() => { setRunning(false); setMode('focus'); setLeft(25 * 60) }}>{s.pomodoro.focus}</button>
        <button className={`tab ${mode === 'short' ? 'active' : ''}`} onClick={() => { setRunning(false); setMode('short'); setLeft(5 * 60) }}>{s.pomodoro.short}</button>
      </div>
      <div className="time-display" style={{ color: mode === 'focus' ? 'var(--accent)' : 'var(--success, #2ecc71)' }}>{mm}:{ss}</div>
      <div className="tool-actions">
        <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={() => setRunning(!running)}>{running ? '⏸ ' + s.pomodoro.pause : '▶ ' + s.pomodoro.start}</button>
        <button className="btn btn-ghost" onClick={() => { setRunning(false); setLeft(mode === 'focus' ? 25 * 60 : 5 * 60) }}>{s.pomodoro.reset}</button>
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 10 }}>🍅 {sessions} {s.pomodoro.sessions}</p>
    </div>
  )
}

function TipSplitter({ s }) {
  const [bill, setBill] = useState('100')
  const [tip, setTip] = useState('10')
  const [people, setPeople] = useState('2')
  const b = parseFloat(bill) || 0
  const t = parseFloat(tip) || 0
  const p = Math.max(1, parseInt(people) || 1)
  const total = b + (b * t) / 100
  return (
    <div className="card tool-card">
      <h3>🍽 {s.tip.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.tip.bill} (₹/$)</span><input type="number" value={bill} onChange={(e) => setBill(e.target.value)} /></label>
        <label className="field"><span>{s.tip.tip} (%)</span><input type="number" value={tip} onChange={(e) => setTip(e.target.value)} /></label>
        <label className="field"><span>{s.tip.people}</span><input type="number" min="1" value={people} onChange={(e) => setPeople(e.target.value)} /></label>
      </div>
      <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        <div><b>{fmt(total, 2)}</b><span>Total</span></div>
        <div><b>{fmt(total / p, 2)}</b><span>{s.tip.perPerson}</span></div>
      </div>
    </div>
  )
}

function BMI({ s }) {
  const [h, setH] = useState('170')
  const [w, setW] = useState('65')
  const [bmi, setBmi] = useState(null)
  const calc = () => {
    const hm = parseFloat(h) / 100
    const kg = parseFloat(w)
    if (!hm || !kg) return
    const v = kg / (hm * hm)
    setBmi(+v.toFixed(1))
  }
  const cat = bmi === null ? '' : bmi < 18.5 ? s.bmi.tips.under : bmi < 25 ? s.bmi.tips.normal : bmi < 30 ? s.bmi.tips.over : s.bmi.tips.obese
  return (
    <div className="card tool-card">
      <h3>⚖️ {s.bmi.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.bmi.height}</span><input type="number" value={h} onChange={(e) => setH(e.target.value)} /></label>
        <label className="field"><span>{s.bmi.weight}</span><input type="number" value={w} onChange={(e) => setW(e.target.value)} /></label>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={calc}>{s.bmi.calc}</button>
      {bmi !== null && (
        <div className="bmi-result">
          <b style={{ fontSize: 26 }}>{bmi}</b>
          <span style={{ color: 'var(--accent)' }}>{cat}</span>
        </div>
      )}
    </div>
  )
}

function CaseConverter({ s }) {
  const [text, setText] = useState('')
  const out = (fn) => () => setText(text.split(/(\s+)/).map(fn).join(''))
  const titleCase = () => setText(text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))
  const sentenceCase = () => setText(text.toLowerCase().replace(/^|(\.\s*)\w/g, (m) => m.toUpperCase()))
  return (
    <div className="card tool-card">
      <h3>🔠 {s.case.title}</h3>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={s.case.ph} />
      <div className="case-btns">
        <button className="btn btn-ghost" onClick={out((w) => w.toUpperCase())}>{s.case.upper}</button>
        <button className="btn btn-ghost" onClick={out((w) => w.toLowerCase())}>{s.case.lower}</button>
        <button className="btn btn-ghost" onClick={titleCase}>{s.case.tcase}</button>
        <button className="btn btn-ghost" onClick={sentenceCase}>{s.case.capital}</button>
      </div>
    </div>
  )
}

function RandomGen({ s }) {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [num, setNum] = useState(null)
  const [coin, setCoin] = useState('—')
  const [dice, setDice] = useState('—')
  const [color, setColor] = useState('#7c6cff')
  const [names, setNames] = useState('')
  const [pick, setPick] = useState('')
  const rollNum = () => setNum(Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min))
  const flip = () => setCoin(Math.random() < 0.5 ? 'Heads' : 'Tails')
  const rollDice = () => setDice(String(Math.floor(Math.random() * 6) + 1))
  const randColor = () => setColor('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
  const pickName = () => {
    const list = names.split(',').map((n) => n.trim()).filter(Boolean)
    if (list.length) setPick(list[Math.floor(Math.random() * list.length)])
  }
  return (
    <div className="card tool-card">
      <h3>🎲 {s.random.title}</h3>
      <div className="random-row">
        <div className="rand-item">
          <label className="field"><span>{s.random.min}</span><input type="number" value={min} onChange={(e) => setMin(e.target.value)} /></label>
          <label className="field"><span>{s.random.max}</span><input type="number" value={max} onChange={(e) => setMax(e.target.value)} /></label>
          <button className="btn btn-primary" onClick={rollNum}>{s.random.roll}</button>
          <b>{num ?? '—'}</b>
        </div>
      </div>
      <div className="rand-btns">
        <button className="btn btn-ghost" onClick={flip}>🪙 {s.random.coin}: <b>{coin}</b></button>
        <button className="btn btn-ghost" onClick={rollDice}>🎲 {s.random.dice}: <b>{dice}</b></button>
        <button className="btn btn-ghost" onClick={randColor}>🎨 {s.random.color}</button>
        <span className="swatch" style={{ background: color }} />
      </div>
      <div className="rand-name" style={{ marginTop: 12 }}>
        <input value={names} onChange={(e) => setNames(e.target.value)} placeholder={s.random.name} />
        <button className="btn btn-ghost" onClick={pickName}>{s.random.pick}</button>
        {pick && <b style={{ marginLeft: 8 }}>→ {pick}</b>}
      </div>
    </div>
  )
}

function DateTime({ s }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const start = new Date(now.getFullYear(), 0, 0)
  const doy = Math.floor((now - start) / 86400000)
  const daysLeft = now.getFullYear() % 4 === 0 ? 366 - doy : 365 - doy
  return (
    <div className="card tool-card stopwatch-card">
      <h3>📅 {s.datetime.title}</h3>
      <div className="time-display" style={{ fontSize: 30 }}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
      <div style={{ marginBottom: 12, color: 'var(--text-dim)' }}>{s.datetime.today} <b style={{ color: 'var(--text)' }}>{now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b></div>
      <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        <div><b>{doy}</b><span>{s.datetime.dayOfYear}</span></div>
        <div><b>{daysLeft}</b><span>{s.datetime.daysLeft} {now.getFullYear()}</span></div>
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
    } catch { /* ignore */ }
  }
  return (
    <div className="card tool-card">
      <h3>🔐 {s.password.title}</h3>
      <div className="pw-row">
        <input readOnly value={pw} placeholder="••••••••" style={{ fontFamily: 'monospace' }} />
        <button className="btn btn-primary" onClick={gen}>{s.password.gen}</button>
      </div>
      <div className="pw-controls">
        <label className="field" style={{ maxWidth: 160 }}>
          <span>{s.password.len}: {len}</span>
          <input type="range" min="6" max="40" value={len} onChange={(e) => setLen(+e.target.value)} />
        </label>
        <button className="btn btn-ghost" onClick={copy} disabled={!pw}>{copied ? '✅ ' + s.copy : '📋'}</button>
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
      <h3>✍️ {s.counter.title}</h3>
      <textarea rows={3} placeholder={s.counter.ph} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="counter-stats">
        <div><b>{words}</b><span>{s.counter.words}</span></div>
        <div><b>{chars}</b><span>{s.counter.chars}</span></div>
        <div><b>{letters}</b><span>{s.counter.letters}</span></div>
        <div><b>{lines}</b><span>{s.counter.lines}</span></div>
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
  const fmtT = (m) => {
    const min = Math.floor(m / 60000)
    const sec = Math.floor((m % 60000) / 1000)
    const cs = Math.floor((m % 1000) / 10)
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }
  return (
    <div className="card tool-card stopwatch-card">
      <h3>⏱️ {s.stopwatch.title}</h3>
      <div className="time-display">{fmtT(ms)}</div>
      <div className="tool-actions">
        <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={() => setRunning(!running)}>{running ? '⏸ ' + s.stopwatch.stop : '▶ ' + s.stopwatch.start}</button>
        <button className="btn btn-ghost" onClick={() => { setRunning(false); setMs(0) }}>{s.stopwatch.reset}</button>
      </div>
    </div>
  )
}

function QuoteBox({ s, lang }) {
  const quotes = lang === 'hi' ? QUOTES_HI : QUOTES_EN
  const [q, setQ] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  return (
    <div className="card tool-card quote-card">
      <h3>💬 {s.quote.title}</h3>
      <p className="quote-text">“{q}”</p>
      <button className="btn btn-ghost" onClick={() => setQ(quotes[Math.floor(Math.random() * quotes.length)])}>🔄 {s.quote.more}</button>
    </div>
  )
}

// ---------- Hub ----------

const GENERAL = ['converter', 'calculator', 'currency', 'weather', 'dictionary', 'pomodoro', 'tip', 'bmi', 'case', 'random', 'datetime', 'password', 'counter', 'stopwatch', 'quote']
const TOOL_ICON = { converter: '📐', calculator: '🧮', currency: '💱', weather: '🌦', dictionary: '📖', pomodoro: '🎯', tip: '🍽', bmi: '⚖️', case: '🔠', random: '🎲', datetime: '📅', password: '🔐', counter: '✍️', stopwatch: '⏱️', quote: '💬' }
const ALL_CATEGORIES = [...PRO_CATEGORIES, ...P2_CATEGORIES, ...P3_CATEGORIES]
const ALL_TAB = { ...PRO_TAB, ...P2_TAB, ...P3_TAB }
const ALL_RENDER = { ...PRO_RENDER, ...P2_RENDER, ...P3_RENDER }
const ALL_STRINGS = {
  en: { ...PRO_STRINGS.en, ...P2_STRINGS.en, ...P3_STRINGS.en },
  hi: { ...PRO_STRINGS.hi, ...P2_STRINGS.hi, ...P3_STRINGS.hi },
}
const ALL_TOOLS = [...GENERAL, ...ALL_CATEGORIES.flatMap((c) => c.tools)]

export default function Tools({ initialTool }) {
  const { lang } = useApp()
  const base = S[lang] || S.en
  const extra = ALL_STRINGS[lang] || ALL_STRINGS.en
  const s = { ...base, ...extra, tabs: { ...base.tabs, ...extra.tabs }, units: { ...base.units, ...extra.units } }
  const [tab, setTab] = useState(ALL_TOOLS.includes(initialTool) ? initialTool : 'converter')
  useEffect(() => {
    if (ALL_TOOLS.includes(initialTool)) setTab(initialTool)
  }, [initialTool])

  const render = () => {
    if (ALL_RENDER[tab]) {
      const C = ALL_RENDER[tab]
      return <C s={s} lang={lang} />
    }
    switch (tab) {
      case 'converter': return <UnitConverter s={s} />
      case 'calculator': return <Calculator s={s} />
      case 'currency': return <CurrencyConverter s={s} />
      case 'weather': return <Weather s={s} />
      case 'dictionary': return <Dictionary s={s} />
      case 'pomodoro': return <Pomodoro s={s} />
      case 'tip': return <TipSplitter s={s} />
      case 'bmi': return <BMI s={s} />
      case 'case': return <CaseConverter s={s} />
      case 'random': return <RandomGen s={s} />
      case 'datetime': return <DateTime s={s} />
      case 'password': return <PasswordGen s={s} />
      case 'counter': return <TextCounter s={s} />
      case 'stopwatch': return <Stopwatch s={s} />
      default: return <QuoteBox s={s} lang={lang} />
    }
  }

  const categories = [
    { id: 'general', icon: '🧰', label: s.cats.general, tools: GENERAL },
    ...ALL_CATEGORIES.map((c) => ({ ...c, label: s.cats[c.id] })),
  ]

  return (
    <section className="section" style={{ paddingTop: 110, minHeight: '75vh' }}>
      <div className="container">
        <h2 className="section-title">🧰 {s.title}</h2>
        <p className="section-sub">{s.sub}</p>
        <div className="tool-tabs">
          {categories.map((cat) => (
            <div key={cat.id} className="tool-cat">
              <div className="tool-cat-label">{cat.icon} {cat.label}</div>
              <div className="tool-cat-tabs">
                {cat.tools.map((id) => (
                  <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
                    {TOOL_ICON[id] || ALL_TAB[id]} {s.tabs[id]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tool-panel">{render()}</div>
      </div>
    </section>
  )
}
