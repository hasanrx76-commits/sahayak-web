import { useState } from 'react'

const fmt = (n, d = 4) => (isNaN(n) || !isFinite(n) ? '' : +Number(n).toFixed(d))
const money = (n) => (isNaN(n) ? '0' : Math.round(n).toLocaleString('en-IN'))
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t } return a }
const Res = ({ rows }) => (
  <div className="tool-result">{rows.map((r, i) => <div key={i} className="row"><span>{r[0]}</span><b>{r[1]}</b></div>)}</div>
)

export const P2_CATEGORIES = [
  { id: 'student', icon: '🎓', tools: ['gpa', 'stat', 'lcmhcf', 'prime', 'roman', 'words', 'quad', 'fraction'] },
  { id: 'kitchen', icon: '👩‍🍳', tools: ['recipe', 'oven', 'measure', 'rice'] },
  { id: 'travel', icon: '✈️', tools: ['timezone', 'distance', 'budget', 'speed', 'volume'] },
  { id: 'home', icon: '🏠', tools: ['electricity', 'appliance', 'sleep'] },
]

export const P2_TAB = {
  gpa: '🎓', stat: '📊', lcmhcf: '➗', prime: '🔢', roman: '🏛️', words: '🔤', quad: '📐', fraction: '🍕',
  recipe: '👩‍🍳', oven: '🌡️', measure: '🥄', rice: '🍚',
  timezone: '🕐', distance: '🧭', budget: '💼', speed: '🚗', volume: '📦',
  electricity: '💡', appliance: '🧊', sleep: '😴',
}

export const P2_STRINGS = {
  en: {
    cats: { student: 'Student', kitchen: 'Kitchen', travel: 'Travel', home: 'Home' },
    tabs: {
      gpa: 'GPA', stat: 'Stats', lcmhcf: 'LCM/HCF', prime: 'Prime', roman: 'Roman', words: 'Words', quad: 'Quadratic', fraction: 'Fractions',
      recipe: 'Recipe', oven: 'Oven', measure: 'Measures', rice: 'Rice',
      timezone: 'Time Zone', distance: 'Distance', budget: 'Budget', speed: 'SDT', volume: 'Luggage',
      electricity: 'Power Bill', appliance: 'Appliance', sleep: 'Sleep',
    },
    gpa: { title: 'GPA / CGPA', pct: 'Percentage (%)', cgpa: 'CGPA (10 point)', gpa: 'GPA (4 point)' },
    stat: { title: 'Mean · Median · Mode', nums: 'Numbers (comma separated)', mean: 'Mean', median: 'Median', mode: 'Mode' },
    lcmhcf: { title: 'LCM & HCF', a: 'Number 1', b: 'Number 2', c: 'Number 3 (optional)', lcm: 'LCM', hcf: 'HCF' },
    prime: { title: 'Prime Checker', num: 'Number', is: 'Result', prime: 'Prime number', not: 'Not prime', factors: 'Divisors', count: 'No. of divisors' },
    roman: { title: 'Roman Numerals', num: 'Number (1–3999)', roman: 'Roman', rev: 'Roman → Number', value: 'Value' },
    words: { title: 'Number to Words', num: 'Number', out: 'In words' },
    quad: { title: 'Quadratic Solver', a: 'a', b: 'b', c: 'c', r1: 'Root 1', r2: 'Root 2', none: 'No real roots' },
    fraction: { title: 'Fraction Calculator', a: 'a', b: 'b', c: 'c', d: 'd', res: 'Result' },
    recipe: { title: 'Recipe Scaler', orig: 'Original servings', target: 'New servings', amt: 'Ingredient amount', amtOut: 'Scaled amount', factor: 'Scale factor' },
    oven: { title: 'Oven Temperature', c: '°C', f: '°F', gas: 'Gas Mark', note: 'Fill any one field' },
    measure: { title: 'Baking Measures', vol: 'Volume', wt: 'Weight', value: 'Value', from: 'From', to: 'To', vnote: '1 cup = 240 ml · 1 tbsp = 15 ml · 1 tsp = 5 ml', wnote: '1 kg = 1000 g · 1 lb = 453.6 g · 1 oz = 28.35 g' },
    rice: { title: 'Rice & Water', servings: 'Servings', rice: 'Rice (dry)', water: 'Water', note: 'Standard ratio 1 : 1.5 (rice : water)' },
    timezone: { title: 'Time Zone Converter', time: 'Time (HH:MM)', from: 'From (UTC)', to: 'To (UTC)', out: 'Converted time' },
    distance: { title: 'City Distance', lat1: 'Lat A', lon1: 'Lon A', lat2: 'Lat B', lon2: 'Lon B', km: 'Distance (km)', mi: 'Distance (miles)' },
    budget: { title: 'Trip Budget', days: 'Days', transport: 'Transport (total)', stay: 'Stay / night', food: 'Food / day', misc: 'Misc (total)', total: 'Total budget' },
    speed: { title: 'Speed · Distance · Time', dist: 'Distance', speed: 'Speed', time: 'Time', note: 'Enter any two values', du: 'km', su: 'km/h', tu: 'h' },
    volume: { title: 'Luggage Volume', l: 'Length (cm)', w: 'Width (cm)', h: 'Height (cm)', lit: 'Volume (liters)', ft: 'Cubic feet', check: 'Airline check (L+W+H)', ok: 'OK', over: 'Over limit (158 cm)' },
    electricity: { title: 'Electricity Bill', units: 'Units consumed', rate: 'Rate per unit (₹)', fixed: 'Fixed charge (₹)', bill: 'Total bill' },
    appliance: { title: 'Appliance Cost', watts: 'Wattage (W)', hours: 'Hours / day', rate: 'Rate per kWh (₹)', day: 'Cost / day', month: 'Cost / month', units: 'Units / month' },
    sleep: { title: 'Sleep Calculator', wake: 'Wake-up time', note: 'Bedtimes for 4–6 sleep cycles (90 min each)', cycles: 'Suggested bedtimes' },
  },
  hi: {
    cats: { student: 'छात्र', kitchen: 'रसोई', travel: 'यात्रा', home: 'घर' },
    tabs: {
      gpa: 'GPA', stat: 'आँकड़े', lcmhcf: 'LCM/HCF', prime: 'अभाज्य', roman: 'रोमन', words: 'शब्द', quad: 'द्विघात', fraction: 'भिन्न',
      recipe: 'रेसिपी', oven: 'ओवन', measure: 'माप', rice: 'चावल',
      timezone: 'समय क्षेत्र', distance: 'दूरी', budget: 'बजट', speed: 'चाल', volume: 'सामान',
      electricity: 'बिजली बिल', appliance: 'उपकरण', sleep: 'नींद',
    },
    gpa: { title: 'GPA / CGPA', pct: 'प्रतिशत (%)', cgpa: 'CGPA (10 अंक)', gpa: 'GPA (4 अंक)' },
    stat: { title: 'माध्य · माध्यिका · बहुलक', nums: 'संख्याएँ (कॉमा से अलग)', mean: 'माध्य', median: 'माध्यिका', mode: 'बहुलक' },
    lcmhcf: { title: 'LCM और HCF', a: 'संख्या 1', b: 'संख्या 2', c: 'संख्या 3 (वैकल्पिक)', lcm: 'LCM', hcf: 'HCF' },
    prime: { title: 'अभाज्य जाँच', num: 'संख्या', is: 'परिणाम', prime: 'अभाज्य संख्या', not: 'अभाज्य नहीं', factors: 'भाजक', count: 'भाजकों की संख्या' },
    roman: { title: 'रोमन अंक', num: 'संख्या (1–3999)', roman: 'रोमन', rev: 'रोमन → संख्या', value: 'मान' },
    words: { title: 'संख्या से शब्द', num: 'संख्या', out: 'शब्दों में' },
    quad: { title: 'द्विघात समीकरण', a: 'a', b: 'b', c: 'c', r1: 'मूल 1', r2: 'मूल 2', none: 'कोई वास्तविक मूल नहीं' },
    fraction: { title: 'भिन्न कैलकुलेटर', a: 'a', b: 'b', c: 'c', d: 'd', res: 'परिणाम' },
    recipe: { title: 'रेसिपी स्केलर', orig: 'मूल सर्विंग', target: 'नई सर्विंग', amt: 'सामग्री मात्रा', amtOut: 'बदली मात्रा', factor: 'स्केल फैक्टर' },
    oven: { title: 'ओवन तापमान', c: '°C', f: '°F', gas: 'गैस मार्क', note: 'कोई एक फील्ड भरें' },
    measure: { title: 'बेकिंग माप', vol: 'आयतन', wt: 'वज़न', value: 'मान', from: 'से', to: 'में', vnote: '1 कप = 240 मि.ली. · 1 टेबलस्पून = 15 मि.ली. · 1 टीस्पून = 5 मि.ली.', wnote: '1 किलो = 1000 ग्राम · 1 पाउंड = 453.6 ग्राम · 1 औंस = 28.35 ग्राम' },
    rice: { title: 'चावल और पानी', servings: 'सर्विंग', rice: 'चावल (सूखा)', water: 'पानी', note: 'सामान्य अनुपात 1 : 1.5 (चावल : पानी)' },
    timezone: { title: 'समय क्षेत्र कन्वर्टर', time: 'समय (HH:MM)', from: 'से (UTC)', to: 'में (UTC)', out: 'बदला समय' },
    distance: { title: 'शहरों की दूरी', lat1: 'अक्षांश A', lon1: 'देशांतर A', lat2: 'अक्षांश B', lon2: 'देशांतर B', km: 'दूरी (किमी)', mi: 'दूरी (मील)' },
    budget: { title: 'यात्रा बजट', days: 'दिन', transport: 'यातायात (कुल)', stay: 'ठहराव / रात', food: 'खाना / दिन', misc: 'अन्य (कुल)', total: 'कुल बजट' },
    speed: { title: 'चाल · दूरी · समय', dist: 'दूरी', speed: 'चाल', time: 'समय', note: 'कोई दो मान डालें', du: 'किमी', su: 'किमी/घं', tu: 'घं' },
    volume: { title: 'सामान का आयतन', l: 'लंबाई (सेमी)', w: 'चौड़ाई (सेमी)', h: 'ऊंचाई (सेमी)', lit: 'आयतन (लीटर)', ft: 'घन फुट', check: 'एयरलाइन जाँच (L+W+H)', ok: 'ठीक', over: 'सीमा से ज़्यादा (158 सेमी)' },
    electricity: { title: 'बिजली बिल', units: 'यूनिट खपत', rate: 'दर प्रति यूनिट (₹)', fixed: 'फिक्स चार्ज (₹)', bill: 'कुल बिल' },
    appliance: { title: 'उपकरण खर्च', watts: 'वाटेज (W)', hours: 'घंटे / दिन', rate: 'दर प्रति kWh (₹)', day: 'खर्च / दिन', month: 'खर्च / महीना', units: 'यूनिट / महीना' },
    sleep: { title: 'नींद कैलकुलेटर', wake: 'जागने का समय', note: '4–6 नींद चक्रों (90 मिनट) के लिए सोने का समय', cycles: 'सुझाए गए समय' },
  },
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const twoW = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''))
const threeW = (n) => {
  const h = Math.floor(n / 100)
  let s = h ? ONES[h] + ' hundred' : ''
  const r = n % 100
  if (r) s += (s ? ' ' : '') + twoW(r)
  return s || 'zero'
}
function toWords(n) {
  if (n === 0) return 'zero'
  if (n < 0) return 'minus ' + toWords(-n)
  const crore = Math.floor(n / 1e7)
  const lakh = Math.floor((n % 1e7) / 1e5)
  const thousand = Math.floor((n % 1e5) / 1e3)
  const rest = n % 1000
  let s = ''
  if (crore) s += threeW(crore) + ' crore'
  if (lakh) s += (s ? ' ' : '') + threeW(lakh) + ' lakh'
  if (thousand) s += (s ? ' ' : '') + threeW(thousand) + ' thousand'
  if (rest) s += (s ? ' ' : '') + threeW(rest)
  return s
}

const ROMAN_V = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
const toRoman = (n) => {
  if (n < 1 || n > 3999) return ''
  let s = ''
  for (const [v, str] of ROMAN_V) while (n >= v) { s += str; n -= v }
  return s
}
const fromRoman = (r) => {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < r.length; i++) {
    const v = map[r[i]]; const nx = map[r[i + 1]]
    total += nx && nx > v ? -v : v
  }
  return total || ''
}

function GPA({ s }) {
  const [pct, setPct] = useState('85')
  const p = parseFloat(pct) || 0
  return <div className="card tool-card"><h3>🎓 {s.gpa.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.gpa.pct}</span><input type="number" value={pct} onChange={(e) => setPct(e.target.value)} /></label>
    </div>
    <Res rows={[[s.gpa.cgpa, fmt(p / 9.5, 2)], [s.gpa.gpa, fmt(p / 25, 2)]]} />
  </div>
}

function Stats({ s }) {
  const [txt, setTxt] = useState('1,2,3,4,5')
  const nums = txt.split(',').map((x) => parseFloat(x.trim())).filter((x) => !isNaN(x))
  const n = nums.length
  const mean = n ? nums.reduce((a, b) => a + b, 0) / n : 0
  const sorted = [...nums].sort((a, b) => a - b)
  const median = n ? (n % 2 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : 0
  const freq = {}
  nums.forEach((x) => { freq[x] = (freq[x] || 0) + 1 })
  let mode = null; let max = 0
  for (const k in freq) if (freq[k] > max) { max = freq[k]; mode = +k }
  return <div className="card tool-card"><h3>📊 {s.stat.title}</h3>
    <div className="tool-grid">
      <label className="field" style={{ gridColumn: '1 / -1' }}><span>{s.stat.nums}</span><input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} /></label>
    </div>
    <Res rows={[[s.stat.mean, fmt(mean, 2)], [s.stat.median, fmt(median, 2)], [s.stat.mode, mode === null ? '—' : fmt(mode, 2)]]} />
  </div>
}

function LcmHcf({ s }) {
  const [a, setA] = useState('12')
  const [b, setB] = useState('18')
  const [c, setC] = useState('')
  const na = parseInt(a) || 0; const nb = parseInt(b) || 0; const nc = parseInt(c) || 0
  let lcm = na && nb ? na * nb / gcd(na, nb) : 0
  let hcf = gcd(na, nb)
  if (nc) { lcm = lcm * nc / gcd(lcm, nc); hcf = gcd(hcf, nc) }
  return <div className="card tool-card"><h3>➗ {s.lcmhcf.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.lcmhcf.a}</span><input type="number" value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="field"><span>{s.lcmhcf.b}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} /></label>
      <label className="field"><span>{s.lcmhcf.c}</span><input type="number" value={c} onChange={(e) => setC(e.target.value)} /></label>
    </div>
    <Res rows={[[s.lcmhcf.lcm, lcm || '—'], [s.lcmhcf.hcf, hcf || '—']]} />
  </div>
}

function Prime({ s }) {
  const [num, setNum] = useState('97')
  const n = parseInt(num) || 0
  let prime = n > 1
  for (let i = 2; i * i <= n && prime; i++) if (n % i === 0) prime = false
  let divs = 0
  for (let i = 1; i * i <= n; i++) if (n % i === 0) divs += i * i === n ? 1 : 2
  return <div className="card tool-card"><h3>🔢 {s.prime.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.prime.num}</span><input type="number" value={num} onChange={(e) => setNum(e.target.value)} /></label>
    </div>
    <Res rows={[[s.prime.is, prime ? '✅ ' + s.prime.prime : '❌ ' + s.prime.not], [s.prime.count, divs]]} />
  </div>
}

function Roman({ s }) {
  const [num, setNum] = useState('1987')
  const [rom, setRom] = useState('MCMLXXXVII')
  const n = parseInt(num) || 0
  return <div className="card tool-card"><h3>🏛️ {s.roman.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.roman.num}</span><input type="number" value={num} onChange={(e) => setNum(e.target.value)} /></label>
      <label className="field"><span>{s.roman.roman}</span><input type="text" value={toRoman(n)} readOnly /></label>
      <label className="field"><span>{s.roman.rev}</span><input type="text" value={rom} onChange={(e) => setRom(e.target.value.toUpperCase())} /></label>
      <label className="field"><span>{s.roman.value}</span><input type="number" value={fromRoman(rom) || ''} readOnly /></label>
    </div>
  </div>
}

function Words({ s }) {
  const [num, setNum] = useState('1250000')
  const n = parseInt(num) || 0
  return <div className="card tool-card"><h3>🔤 {s.words.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.words.num}</span><input type="number" value={num} onChange={(e) => setNum(e.target.value)} /></label>
    </div>
    <div className="tool-result"><div className="row"><span>{s.words.out}</span><b style={{ textTransform: 'capitalize' }}>{toWords(n)}</b></div></div>
  </div>
}

function Quad({ s }) {
  const [a, setA] = useState('1')
  const [b, setB] = useState('-3')
  const [c, setC] = useState('2')
  const A = parseFloat(a) || 0; const B = parseFloat(b) || 0; const C = parseFloat(c) || 0
  const disc = B * B - 4 * A * C
  let r1 = '—'; let r2 = '—'
  if (A !== 0) {
    if (disc >= 0) { r1 = fmt((-B + Math.sqrt(disc)) / (2 * A), 3); r2 = fmt((-B - Math.sqrt(disc)) / (2 * A), 3) }
    else { r1 = s.quad.none; r2 = '' }
  }
  return <div className="card tool-card"><h3>📐 {s.quad.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.quad.a}</span><input type="number" value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="field"><span>{s.quad.b}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} /></label>
      <label className="field"><span>{s.quad.c}</span><input type="number" value={c} onChange={(e) => setC(e.target.value)} /></label>
    </div>
    <Res rows={[[s.quad.r1, r1], [s.quad.r2, r2]]} />
  </div>
}

function Fraction({ s }) {
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [op, setOp] = useState('+')
  const [c, setC] = useState('1')
  const [d, setD] = useState('3')
  const A = parseFloat(a) || 0; const B = parseFloat(b) || 0; const C = parseFloat(c) || 0; const D = parseFloat(d) || 0
  let num = 0; let den = B * D
  if (op === '+') num = A * D + C * B
  if (op === '-') num = A * D - C * B
  if (op === '×') { num = A * C; den = B * D }
  if (op === '÷') { num = A * D; den = B * C }
  const g = gcd(num, den)
  const sn = num / g; const sd = den / g
  const str = sd === 1 ? String(sn) : `${sn} / ${sd}`
  return <div className="card tool-card"><h3>🍕 {s.fraction.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.fraction.a}</span><input type="number" value={a} onChange={(e) => setA(e.target.value)} /></label>
      <label className="field"><span>{s.fraction.b}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} /></label>
      <label className="field"><span>± × ÷</span>
        <select value={op} onChange={(e) => setOp(e.target.value)}><option>+</option><option>-</option><option>×</option><option>÷</option></select>
      </label>
      <label className="field"><span>{s.fraction.c}</span><input type="number" value={c} onChange={(e) => setC(e.target.value)} /></label>
      <label className="field"><span>{s.fraction.d}</span><input type="number" value={d} onChange={(e) => setD(e.target.value)} /></label>
    </div>
    <Res rows={[[s.fraction.res, B && D ? str : '—']]} />
  </div>
}

function Recipe({ s }) {
  const [orig, setOrig] = useState('4')
  const [target, setTarget] = useState('6')
  const [amt, setAmt] = useState('200')
  const o = parseFloat(orig) || 1; const t = parseFloat(target) || 0; const v = parseFloat(amt) || 0
  const factor = o ? t / o : 0
  return <div className="card tool-card"><h3>👩‍🍳 {s.recipe.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.recipe.orig}</span><input type="number" value={orig} onChange={(e) => setOrig(e.target.value)} /></label>
      <label className="field"><span>{s.recipe.target}</span><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
      <label className="field"><span>{s.recipe.amt}</span><input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
    </div>
    <Res rows={[[s.recipe.factor, fmt(factor, 2) + '×'], [s.recipe.amtOut, fmt(v * factor, 2)]]} />
  </div>
}

const GAS = { 1: 140, 2: 150, 3: 165, 4: 180, 5: 190, 6: 200, 7: 220, 8: 230, 9: 240 }
function Oven({ s }) {
  const [c, setC] = useState('180')
  const [f, setF] = useState('')
  const [g, setG] = useState('')
  const changeC = (v) => {
    const C = parseFloat(v)
    setC(v)
    if (!isNaN(C)) { setF(fmt(C * 9 / 5 + 32, 0)); setG(String(nearestGas(C))) } else { setF(''); setG('') }
  }
  const changeF = (v) => {
    const F = parseFloat(v)
    setF(v)
    if (!isNaN(F)) { setC(fmt((F - 32) * 5 / 9, 0)); setG(String(nearestGas((F - 32) * 5 / 9))) } else { setC(''); setG('') }
  }
  const changeG = (v) => {
    setG(v)
    const C = GAS[+v]
    if (C) { setC(fmt(C, 0)); setF(fmt(C * 9 / 5 + 32, 0)) } else { setC(''); setF('') }
  }
  return <div className="card tool-card"><h3>🌡️ {s.oven.title}</h3>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{s.oven.note}</p>
    <div className="tool-grid">
      <label className="field"><span>{s.oven.c}</span><input type="number" value={c} onChange={(e) => changeC(e.target.value)} /></label>
      <label className="field"><span>{s.oven.f}</span><input type="number" value={f} onChange={(e) => changeF(e.target.value)} /></label>
      <label className="field"><span>{s.oven.gas}</span>
        <select value={g} onChange={(e) => changeG(e.target.value)}><option value="">—</option>{Object.keys(GAS).map((k) => <option key={k} value={k}>{k}</option>)}</select>
      </label>
    </div>
  </div>
}
const nearestGas = (C) => {
  let best = 4; let diff = 1e9
  for (const k in GAS) { const d = Math.abs(GAS[k] - C); if (d < diff) { diff = d; best = +k } }
  return best
}

const VOL_U = { ml: 1, cup: 240, tbsp: 15, tsp: 5, floz: 30 }
const WT_U = { g: 1, kg: 1000, lb: 453.6, oz: 28.35 }
function Measure({ s }) {
  const [val, setVal] = useState('1')
  const [from, setFrom] = useState('cup')
  const [to, setTo] = useState('ml')
  const [mode, setMode] = useState('vol')
  const units = mode === 'vol' ? VOL_U : WT_U
  const result = fmt((parseFloat(val) || 0) * units[from] / units[to], 3)
  return <div className="card tool-card"><h3>🥄 {s.measure.title}</h3>
    <div className="tabs" style={{ justifyContent: 'center', marginBottom: 12 }}>
      <button className={`tab ${mode === 'vol' ? 'active' : ''}`} onClick={() => { setMode('vol'); setFrom('cup'); setTo('ml') }}>{s.measure.vol}</button>
      <button className={`tab ${mode === 'wt' ? 'active' : ''}`} onClick={() => { setMode('wt'); setFrom('kg'); setTo('g') }}>{s.measure.wt}</button>
    </div>
    <div className="tool-grid">
      <label className="field"><span>{s.measure.value}</span><input type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
      <label className="field"><span>{s.measure.to}</span><input type="number" readOnly value={result} /></label>
      <select value={from} onChange={(e) => setFrom(e.target.value)}>{Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}</select>
      <select value={to} onChange={(e) => setTo(e.target.value)}>{Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}</select>
    </div>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{mode === 'vol' ? s.measure.vnote : s.measure.wnote}</p>
  </div>
}

function Rice({ s }) {
  const [serv, setServ] = useState('2')
  const n = parseInt(serv) || 0
  const rice = n * 0.5
  const water = rice * 1.5
  return <div className="card tool-card"><h3>🍚 {s.rice.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.rice.servings}</span><input type="number" value={serv} onChange={(e) => setServ(e.target.value)} /></label>
    </div>
    <Res rows={[[s.rice.rice, fmt(rice, 2) + ' cups'], [s.rice.water, fmt(water, 2) + ' cups']]} />
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.rice.note}</p>
  </div>
}

function TimeZone({ s }) {
  const [time, setTime] = useState('12:00')
  const [from, setFrom] = useState('0')
  const [to, setTo] = useState('5.5')
  const [h, m] = time.split(':').map(Number)
  let out = '—'
  if (!isNaN(h) && !isNaN(m)) {
    let total = h * 60 + m + (parseFloat(to) - parseFloat(from)) * 60
    total = ((total % 1440) + 1440) % 1440
    out = String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(Math.round(total % 60)).padStart(2, '0')
  }
  const offs = []
  for (let i = -12; i <= 14; i++) offs.push(i)
  return <div className="card tool-card"><h3>🕐 {s.timezone.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.timezone.time}</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
      <label className="field"><span>{s.timezone.from}</span>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>{offs.map((o) => <option key={o} value={o}>UTC {o > 0 ? '+' : ''}{o}</option>)}</select>
      </label>
      <label className="field"><span>{s.timezone.to}</span>
        <select value={to} onChange={(e) => setTo(e.target.value)}>{[...offs, 5.5, 5.75, 6.5, 9.5].map((o) => <option key={o} value={o}>UTC {o > 0 ? '+' : ''}{o}</option>)}</select>
      </label>
    </div>
    <Res rows={[[s.timezone.out, out]]} />
  </div>
}

function CityDist({ s }) {
  const [lat1, setLat1] = useState('28.6139')
  const [lon1, setLon1] = useState('77.2090')
  const [lat2, setLat2] = useState('19.0760')
  const [lon2, setLon2] = useState('72.8777')
  const R = 6371
  const toRad = (x) => x * Math.PI / 180
  const dLat = toRad((parseFloat(lat2) || 0) - (parseFloat(lat1) || 0))
  const dLon = toRad((parseFloat(lon2) || 0) - (parseFloat(lon1) || 0))
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(parseFloat(lat1) || 0)) * Math.cos(toRad(parseFloat(lat2) || 0)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const km = fmt(R * c, 0)
  const mi = fmt(R * c * 0.621371, 0)
  return <div className="card tool-card"><h3>🧭 {s.distance.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.distance.lat1}</span><input type="number" value={lat1} onChange={(e) => setLat1(e.target.value)} /></label>
      <label className="field"><span>{s.distance.lon1}</span><input type="number" value={lon1} onChange={(e) => setLon1(e.target.value)} /></label>
      <label className="field"><span>{s.distance.lat2}</span><input type="number" value={lat2} onChange={(e) => setLat2(e.target.value)} /></label>
      <label className="field"><span>{s.distance.lon2}</span><input type="number" value={lon2} onChange={(e) => setLon2(e.target.value)} /></label>
    </div>
    <Res rows={[[s.distance.km, km + ' km'], [s.distance.mi, mi + ' mi']]} />
  </div>
}

function Budget({ s }) {
  const [days, setDays] = useState('5')
  const [transport, setTransport] = useState('5000')
  const [stay, setStay] = useState('2000')
  const [food, setFood] = useState('1000')
  const [misc, setMisc] = useState('2000')
  const d = parseInt(days) || 0
  const total = (parseFloat(transport) || 0) + (parseFloat(stay) || 0) * d + (parseFloat(food) || 0) * d + (parseFloat(misc) || 0)
  return <div className="card tool-card"><h3>💼 {s.budget.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.budget.days}</span><input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></label>
      <label className="field"><span>{s.budget.transport}</span><input type="number" value={transport} onChange={(e) => setTransport(e.target.value)} /></label>
      <label className="field"><span>{s.budget.stay}</span><input type="number" value={stay} onChange={(e) => setStay(e.target.value)} /></label>
      <label className="field"><span>{s.budget.food}</span><input type="number" value={food} onChange={(e) => setFood(e.target.value)} /></label>
      <label className="field"><span>{s.budget.misc}</span><input type="number" value={misc} onChange={(e) => setMisc(e.target.value)} /></label>
    </div>
    <Res rows={[[s.budget.total, '₹ ' + money(total)]]} />
  </div>
}

function SDT({ s }) {
  const [dist, setDist] = useState('100')
  const [speed, setSpeed] = useState('50')
  const [time, setTime] = useState('2')
  const d = parseFloat(dist) || 0; const sp = parseFloat(speed) || 0; const t = parseFloat(time) || 0
  const filled = [d, sp, t].filter(Boolean).length
  const outD = filled === 2 && !d ? sp * t : d
  const outS = filled === 2 && !sp ? d / t : sp
  const outT = filled === 2 && !t ? d / sp : t
  return <div className="card tool-card"><h3>🚗 {s.speed.title}</h3>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{s.speed.note}</p>
    <div className="tool-grid">
      <label className="field"><span>{s.speed.dist} ({s.speed.du})</span><input type="number" value={dist} onChange={(e) => setDist(e.target.value)} /></label>
      <label className="field"><span>{s.speed.speed} ({s.speed.su})</span><input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} /></label>
      <label className="field"><span>{s.speed.time} ({s.speed.tu})</span><input type="number" value={time} onChange={(e) => setTime(e.target.value)} /></label>
    </div>
    <Res rows={[[s.speed.dist, fmt(outD, 2) + ' ' + s.speed.du], [s.speed.speed, fmt(outS, 2) + ' ' + s.speed.su], [s.speed.time, fmt(outT, 2) + ' ' + s.speed.tu]]} />
  </div>
}

function Luggage({ s }) {
  const [l, setL] = useState('55')
  const [w, setW] = useState('35')
  const [h, setH] = useState('25')
  const L = parseFloat(l) || 0; const W = parseFloat(w) || 0; const H = parseFloat(h) || 0
  const lit = fmt(L * W * H / 1000, 1)
  const ft = fmt(L * W * H / 28316.8, 2)
  const sum = L + W + H
  return <div className="card tool-card"><h3>📦 {s.volume.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.volume.l}</span><input type="number" value={l} onChange={(e) => setL(e.target.value)} /></label>
      <label className="field"><span>{s.volume.w}</span><input type="number" value={w} onChange={(e) => setW(e.target.value)} /></label>
      <label className="field"><span>{s.volume.h}</span><input type="number" value={h} onChange={(e) => setH(e.target.value)} /></label>
    </div>
    <Res rows={[[s.volume.lit, lit + ' L'], [s.volume.ft, ft + ' ft³'], [s.volume.check, sum <= 158 ? '✅ ' + s.volume.ok : '⚠️ ' + s.volume.over]]} />
  </div>
}

function Electricity({ s }) {
  const [units, setUnits] = useState('200')
  const [rate, setRate] = useState('8')
  const [fixed, setFixed] = useState('50')
  const u = parseFloat(units) || 0; const r = parseFloat(rate) || 0; const f = parseFloat(fixed) || 0
  return <div className="card tool-card"><h3>💡 {s.electricity.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.electricity.units}</span><input type="number" value={units} onChange={(e) => setUnits(e.target.value)} /></label>
      <label className="field"><span>{s.electricity.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
      <label className="field"><span>{s.electricity.fixed}</span><input type="number" value={fixed} onChange={(e) => setFixed(e.target.value)} /></label>
    </div>
    <Res rows={[[s.electricity.bill, '₹ ' + money(u * r + f)]]} />
  </div>
}

function Appliance({ s }) {
  const [watts, setWatts] = useState('1500')
  const [hours, setHours] = useState('2')
  const [rate, setRate] = useState('8')
  const w = parseFloat(watts) || 0; const hr = parseFloat(hours) || 0; const r = parseFloat(rate) || 0
  const unitsM = w * hr * 30 / 1000
  const day = w * hr / 1000 * r
  return <div className="card tool-card"><h3>🧊 {s.appliance.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.appliance.watts}</span><input type="number" value={watts} onChange={(e) => setWatts(e.target.value)} /></label>
      <label className="field"><span>{s.appliance.hours}</span><input type="number" value={hours} onChange={(e) => setHours(e.target.value)} /></label>
      <label className="field"><span>{s.appliance.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
    </div>
    <Res rows={[[s.appliance.units, fmt(unitsM, 1) + ' kWh'], [s.appliance.day, '₹ ' + fmt(day, 1)], [s.appliance.month, '₹ ' + fmt(day * 30, 1)]]} />
  </div>
}

function Sleep({ s }) {
  const [wake, setWake] = useState('07:00')
  const [h, m] = wake.split(':').map(Number)
  const beds = []
  if (!isNaN(h) && !isNaN(m)) {
    const wakeMin = h * 60 + m
    for (const cycles of [6, 5, 4]) {
      const bed = ((wakeMin - cycles * 90) % 1440 + 1440) % 1440
      beds.push(String(Math.floor(bed / 60)).padStart(2, '0') + ':' + String(bed % 60).padStart(2, '0'))
    }
  }
  return <div className="card tool-card"><h3>😴 {s.sleep.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.sleep.wake}</span><input type="time" value={wake} onChange={(e) => setWake(e.target.value)} /></label>
    </div>
    <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '10px 0' }}>{s.sleep.note}</p>
    {beds.length > 0 && (
      <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {beds.map((b, i) => <div key={i}><b style={{ fontSize: 16 }}>{b}</b><span>{6 - i} {s.sleep.cycles}</span></div>)}
      </div>
    )}
  </div>
}

export const P2_RENDER = {
  gpa: GPA, stat: Stats, lcmhcf: LcmHcf, prime: Prime, roman: Roman, words: Words, quad: Quad, fraction: Fraction,
  recipe: Recipe, oven: Oven, measure: Measure, rice: Rice,
  timezone: TimeZone, distance: CityDist, budget: Budget, speed: SDT, volume: Luggage,
  electricity: Electricity, appliance: Appliance, sleep: Sleep,
}
