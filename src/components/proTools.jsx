import { useState } from 'react'

const fmt = (n, d = 4) => (isNaN(n) || !isFinite(n) ? '' : +Number(n).toFixed(d))
const money = (n) => (isNaN(n) ? '0' : Math.round(n).toLocaleString('en-IN'))

export const PRO_CATEGORIES = [
  { id: 'builder', icon: '🏗️', tools: ['brick', 'concrete', 'paint', 'land'] },
  { id: 'engineer', icon: '⚙️', tools: ['resistor', 'ohm', 'steel', 'power'] },
  { id: 'health', icon: '🩺', tools: ['bmr', 'idealwt', 'water', 'heartrate'] },
  { id: 'finance', icon: '💰', tools: ['emi', 'sip', 'gst', 'interest'] },
  { id: 'everyday', icon: '🧮', tools: ['percent', 'age', 'datediff', 'fuel'] },
]

export const PRO_TAB = {
  brick: '🧱', concrete: '🏗️', paint: '🪣', land: '🗺️',
  resistor: '🎛️', ohm: '⚡', steel: '🔩', power: '🔌',
  bmr: '🔥', idealwt: '💪', water: '💧', heartrate: '❤️',
  emi: '🏦', sip: '📈', gst: '🧾', interest: '💹',
  percent: '💯', age: '🎂', datediff: '📆', fuel: '⛽',
}

export const PRO_STRINGS = {
  en: {
    cats: { general: 'Everyday', builder: 'Builder', engineer: 'Engineer', health: 'Health', finance: 'Finance', everyday: 'Date & Math' },
    tabs: {
      brick: 'Bricks', concrete: 'Concrete', paint: 'Paint', land: 'Land',
      resistor: 'Resistor', ohm: 'Ohm\'s Law', steel: 'Steel', power: 'Power',
      bmr: 'BMR', idealwt: 'Ideal Wt', water: 'Water', heartrate: 'Heart Rate',
      emi: 'Loan EMI', sip: 'SIP', gst: 'GST', interest: 'Interest',
      percent: 'Percent', age: 'Age', datediff: 'Date Diff', fuel: 'Fuel',
    },
    brick: { title: 'Brick Calculator', len: 'Wall length (m)', height: 'Wall height (m)', thick: 'Wall thickness (mm)', calc: 'Calculate', vol: 'Brickwork volume', bricks: 'Bricks needed', cement: 'Cement (50kg bags)', sand: 'Sand (m³)', tip: 'Approx. 500 bricks + 4.5 bags cement + 0.3 m³ sand per m³.' },
    concrete: { title: 'Concrete Mix Calculator', len: 'Length (m)', width: 'Width (m)', depth: 'Depth (m)', grade: 'Grade', calc: 'Calculate', vol: 'Wet volume', cement: 'Cement (50kg bags)', sand: 'Sand (m³)', agg: 'Aggregate (m³)' },
    paint: { title: 'Paint Calculator', len: 'Room length (m)', width: 'Room width (m)', height: 'Room height (m)', coats: 'Coats', calc: 'Calculate', wall: 'Wall area (m²)', liters: 'Paint needed (L)', tip: '1 litre covers ≈ 11 m² per coat.' },
    land: { title: 'Land Area Converter', value: 'Value', from: 'From', to: 'To', note: 'Regional values vary — these are common approximations.', units: { sqm: 'Square Meter', sqft: 'Square Feet', acre: 'Acre', hectare: 'Hectare', bigha: 'Bigha', katha: 'Katha', marla: 'Marla', guntha: 'Guntha', ground: 'Ground', cent: 'Cent', biswa: 'Biswa' } },
    resistor: { title: 'Resistor Color Code', band: 'Band', mult: 'Multiplier', tol: 'Tolerance', value: 'Value' },
    ohm: { title: 'Ohm\'s Law', v: 'Voltage', i: 'Current', r: 'Resistance', calc: 'Compute', note: 'Enter any two values', vu: 'V', iu: 'A', ru: 'Ω' },
    steel: { title: 'Steel Weight Calculator', dia: 'Bar diameter (mm)', len: 'Length (m)', pieces: 'Pieces', calc: 'Calculate', perM: 'Weight / metre', total: 'Total weight', tip: 'Formula: d² / 162 kg per metre.' },
    power: { title: 'Electrical Power', v: 'Voltage', i: 'Current', p: 'Power', r: 'Resistance', calc: 'Compute', note: 'Enter any two values' },
    bmr: { title: 'BMR & Daily Calories', gender: 'Gender', male: 'Male', female: 'Female', age: 'Age', weight: 'Weight (kg)', height: 'Height (cm)', activity: 'Activity', calc: 'Calculate', bmr: 'BMR', tdee: 'Daily calories', acts: ['Sedentary (little/no exercise)', 'Light (1–3 days/week)', 'Moderate (3–5 days/week)', 'Active (6–7 days/week)', 'Very active (hard daily)'] },
    idealwt: { title: 'Ideal Weight', gender: 'Gender', male: 'Male', female: 'Female', height: 'Height', calc: 'Calculate', ideal: 'Ideal weight', range: 'Healthy range', tip: 'Based on BMI 18.5–24.9' },
    water: { title: 'Daily Water Intake', weight: 'Weight (kg)', calc: 'Calculate', daily: 'Daily intake', glasses: 'Glasses (250 ml)' },
    heartrate: { title: 'Heart Rate Zones', age: 'Age', max: 'Max heart rate', note: 'Based on 220 − age', zones: ['Warm-up', 'Fat burn', 'Cardio', 'Peak'] },
    emi: { title: 'Loan EMI Calculator', amount: 'Loan amount', rate: 'Interest rate (%/yr)', years: 'Tenure (years)', months: 'Months', calc: 'Calculate', emi: 'Monthly EMI', interest: 'Total interest', total: 'Total payment' },
    sip: { title: 'SIP Calculator', monthly: 'Monthly investment', rate: 'Annual return (%)', years: 'Years', calc: 'Calculate', invested: 'Total invested', gains: 'Est. gains', value: 'Future value' },
    gst: { title: 'GST Calculator', amount: 'Amount', rate: 'GST (%)', add: 'Add GST', excl: 'GST included', calc: 'Calculate', tax: 'GST amount', total: 'Total' },
    interest: { title: 'Interest Calculator', principal: 'Principal', rate: 'Rate (%/yr)', years: 'Years', simple: 'Simple', compound: 'Compound', calc: 'Calculate', total: 'Total amount', interest: 'Interest earned' },
    percent: { title: 'Percent & Discount', xOfY: 'X% of Y', x: 'X (%)', y: 'Y', result: 'Result', disc: 'Discount', price: 'Original price', dc: 'Discount (%)', final: 'Final price', saved: 'You save' },
    age: { title: 'Age Calculator', dob: 'Date of birth', calc: 'Calculate', years: 'years', months: 'months', days: 'days', total: 'Total days alive' },
    datediff: { title: 'Date Difference', from: 'From', to: 'To', calc: 'Calculate', days: 'Days', weeks: 'Weeks', months: 'Months' },
    fuel: { title: 'Fuel Cost', dist: 'Distance (km)', mileage: 'Mileage (km/L)', price: 'Fuel price (₹/L)', calc: 'Calculate', liters: 'Fuel needed (L)', cost: 'Total cost' },
  },
  hi: {
    cats: { general: 'सामान्य', builder: 'निर्माण', engineer: 'इंजीनियर', health: 'स्वास्थ्य', finance: 'वित्त', everyday: 'दिनांक व गणित' },
    tabs: {
      brick: 'ईंटें', concrete: 'कंक्रीट', paint: 'पेंट', land: 'ज़मीन',
      resistor: 'रेसिस्टर', ohm: 'ओम नियम', steel: 'स्टील', power: 'पावर',
      bmr: 'BMR', idealwt: 'आदर्श वज़न', water: 'पानी', heartrate: 'हृदय गति',
      emi: 'लोन EMI', sip: 'SIP', gst: 'GST', interest: 'ब्याज',
      percent: 'प्रतिशत', age: 'उम्र', datediff: 'तारीख अंतर', fuel: 'ईंधन',
    },
    brick: { title: 'ईंट कैलकुलेटर', len: 'दीवार की लंबाई (मी)', height: 'दीवार की ऊंचाई (मी)', thick: 'दीवार की मोटाई (मिमी)', calc: 'गणना करें', vol: 'ईंटचिनाई आयतन', bricks: 'ईंटें चाहिए', cement: 'सीमेंट (50kg बोरी)', sand: 'रेत (मी³)', tip: 'लगभग 500 ईंटें + 4.5 बोरी सीमेंट + 0.3 मी³ रेत प्रति मी³।' },
    concrete: { title: 'कंक्रीट मिक्स कैलकुलेटर', len: 'लंबाई (मी)', width: 'चौड़ाई (मी)', depth: 'गहराई (मी)', grade: 'ग्रेड', calc: 'गणना करें', vol: 'गीला आयतन', cement: 'सीमेंट (50kg बोरी)', sand: 'रेत (मी³)', agg: 'गिट्टी (मी³)' },
    paint: { title: 'पेंट कैलकुलेटर', len: 'कमरे की लंबाई (मी)', width: 'कमरे की चौड़ाई (मी)', height: 'कमरे की ऊंचाई (मी)', coats: 'परतें', calc: 'गणना करें', wall: 'दीवार क्षेत्र (मी²)', liters: 'पेंट चाहिए (ली)', tip: '1 लीटर ≈ 11 मी² प्रति परत।' },
    land: { title: 'ज़मीन क्षेत्र कन्वर्टर', value: 'मान', from: 'से', to: 'में', note: 'क्षेत्रीय मान अलग होते हैं — ये सामान्य अनुमान हैं।', units: { sqm: 'वर्ग मीटर', sqft: 'वर्ग फुट', acre: 'एकड़', hectare: 'हेक्टेयर', bigha: 'बीघा', katha: 'कट्ठा', marla: 'मरला', guntha: 'गुंठा', ground: 'ग्राउंड', cent: 'सेंट', biswa: 'बिस्वा' } },
    resistor: { title: 'रेसिस्टर कलर कोड', band: 'बैंड', mult: 'गुणक', tol: 'सहनशीलता', value: 'मान' },
    ohm: { title: 'ओम का नियम', v: 'वोल्टेज', i: 'करंट', r: 'रेसिस्टेंस', calc: 'गणना करें', note: 'कोई दो मान डालें', vu: 'V', iu: 'A', ru: 'Ω' },
    steel: { title: 'स्टील वज़न कैलकुलेटर', dia: 'बार व्यास (मिमी)', len: 'लंबाई (मी)', pieces: 'टुकड़े', calc: 'गणना करें', perM: 'वज़न / मीटर', total: 'कुल वज़न', tip: 'सूत्र: d² / 162 किलो प्रति मीटर।' },
    power: { title: 'विद्युत शक्ति', v: 'वोल्टेज', i: 'करंट', p: 'शक्ति', r: 'रेसिस्टेंस', calc: 'गणना करें', note: 'कोई दो मान डालें' },
    bmr: { title: 'BMR और दैनिक कैलोरी', gender: 'लिंग', male: 'पुरुष', female: 'महिला', age: 'उम्र', weight: 'वज़न (किलो)', height: 'लंबाई (सेमी)', activity: 'गतिविधि', calc: 'गणना करें', bmr: 'BMR', tdee: 'दैनिक कैलोरी', acts: ['निष्क्रिय (कम या कोई व्यायाम नहीं)', 'हल्का (सप्ताह में 1–3 दिन)', 'मध्यम (3–5 दिन/सप्ताह)', 'सक्रिय (6–7 दिन/सप्ताह)', 'बहुत सक्रिय (रोज़ कड़ी मेहनत)'] },
    idealwt: { title: 'आदर्श वज़न', gender: 'लिंग', male: 'पुरुष', female: 'महिला', height: 'लंबाई', calc: 'गणना करें', ideal: 'आदर्श वज़न', range: 'स्वस्थ सीमा', tip: 'BMI 18.5–24.9 पर आधारित' },
    water: { title: 'दैनिक पानी की मात्रा', weight: 'वज़न (किलो)', calc: 'गणना करें', daily: 'दैनिक पानी', glasses: 'गिलास (250 मिली)' },
    heartrate: { title: 'हृदय गति ज़ोन', age: 'उम्र', max: 'अधिकतम हृदय गति', note: '220 − उम्र पर आधारित', zones: ['वार्म-अप', 'फैट बर्न', 'कार्डियो', 'पीक'] },
    emi: { title: 'लोन EMI कैलकुलेटर', amount: 'लोन राशि', rate: 'ब्याज दर (%/वर्ष)', years: 'अवधि (साल)', months: 'महीने', calc: 'गणना करें', emi: 'मासिक EMI', interest: 'कुल ब्याज', total: 'कुल भुगतान' },
    sip: { title: 'SIP कैलकुलेटर', monthly: 'मासिक निवेश', rate: 'वार्षिक रिटर्न (%)', years: 'साल', calc: 'गणना करें', invested: 'कुल निवेश', gains: 'अनुमानित लाभ', value: 'भविष्य मूल्य' },
    gst: { title: 'GST कैलकुलेटर', amount: 'राशि', rate: 'GST (%)', add: 'GST जोड़ें', excl: 'GST शामिल', calc: 'गणना करें', tax: 'GST राशि', total: 'कुल' },
    interest: { title: 'ब्याज कैलकुलेटर', principal: 'मूलधन', rate: 'दर (%/वर्ष)', years: 'साल', simple: 'साधारण', compound: 'चक्रवृद्धि', calc: 'गणना करें', total: 'कुल राशि', interest: 'ब्याज' },
    percent: { title: 'प्रतिशत और छूट', xOfY: 'X का Y%', x: 'X (%)', y: 'Y', result: 'परिणाम', disc: 'छूट', price: 'मूल कीमत', dc: 'छूट (%)', final: 'अंतिम कीमत', saved: 'आपकी बचत' },
    age: { title: 'उम्र कैलकुलेटर', dob: 'जन्म तिथि', calc: 'गणना करें', years: 'साल', months: 'महीने', days: 'दिन', total: 'कुल दिन' },
    datediff: { title: 'तारीख अंतर', from: 'से', to: 'तक', calc: 'गणना करें', days: 'दिन', weeks: 'हफ्ते', months: 'महीने' },
    fuel: { title: 'ईंधन खर्च', dist: 'दूरी (किमी)', mileage: 'माइलेज (किमी/ली)', price: 'ईंधन कीमत (₹/ली)', calc: 'गणना करें', liters: 'ईंधन (ली)', cost: 'कुल खर्च' },
  },
}

const LAND = { sqm: 1, sqft: 0.092903, acre: 4046.856, hectare: 10000, bigha: 677.268, katha: 66.89, marla: 25.293, guntha: 101.17, ground: 222.967, cent: 40.4686, biswa: 33.86 }
const LAND_ORDER = ['sqm', 'sqft', 'acre', 'hectare', 'bigha', 'katha', 'marla', 'guntha', 'ground', 'cent', 'biswa']

const BAND_COLORS = [
  ['black', '#000000', 0], ['brown', '#8B4513', 1], ['red', '#d32f2f', 2], ['orange', '#ff7f00', 3], ['yellow', '#fbc02d', 4],
  ['green', '#2e7d32', 5], ['blue', '#1565c0', 6], ['violet', '#7b1fa2', 7], ['grey', '#757575', 8], ['white', '#fafafa', 9],
]
const MULT = { black: 1, brown: 10, red: 100, orange: 1e3, yellow: 1e4, green: 1e5, blue: 1e6, violet: 1e7, gold: 0.1, silver: 0.01 }
const MULT_KEYS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gold', 'silver']
const TOL = { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gold: '±5%', silver: '±10%', none: '±20%' }
const TOL_KEYS = ['brown', 'red', 'green', 'blue', 'violet', 'gold', 'silver', 'none']

const fmtRes = (v) => {
  if (v >= 1e6) return fmt(v / 1e6, 2) + ' MΩ'
  if (v >= 1e3) return fmt(v / 1e3, 2) + ' kΩ'
  return fmt(v, 1) + ' Ω'
}

// ---------- Builder ----------

function Brick({ s }) {
  const [len, setLen] = useState('5')
  const [hgt, setHgt] = useState('3')
  const [thk, setThk] = useState('230')
  const L = parseFloat(len) || 0
  const H = parseFloat(hgt) || 0
  const T = (parseFloat(thk) || 0) / 1000
  const vol = fmt(L * H * T, 2)
  const bricks = Math.ceil(L * H * T * 500)
  const cement = Math.ceil(L * H * T * 4.5)
  const sand = fmt(L * H * T * 0.3, 2)
  return (
    <div className="card tool-card">
      <h3>🧱 {s.brick.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.brick.len}</span><input type="number" value={len} onChange={(e) => setLen(e.target.value)} /></label>
        <label className="field"><span>{s.brick.height}</span><input type="number" value={hgt} onChange={(e) => setHgt(e.target.value)} /></label>
        <label className="field"><span>{s.brick.thick}</span><input type="number" value={thk} onChange={(e) => setThk(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.brick.vol}</span><b>{vol} m³</b></div>
        <div className="row"><span>{s.brick.bricks}</span><b>{bricks}</b></div>
        <div className="row"><span>{s.brick.cement}</span><b>{cement}</b></div>
        <div className="row"><span>{s.brick.sand}</span><b>{sand} m³</b></div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.brick.tip}</p>
    </div>
  )
}

const GRADES = [
  ['M10 (1:3:6)', 1, 3, 6], ['M15 (1:2:4)', 1, 2, 4], ['M20 (1:1.5:3)', 1, 1.5, 3], ['M25 (1:1:2)', 1, 1, 2],
]

function Concrete({ s }) {
  const [len, setLen] = useState('3')
  const [wid, setWid] = useState('3')
  const [dep, setDep] = useState('0.15')
  const [grade, setGrade] = useState('M15 (1:2:4)')
  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const D = parseFloat(dep) || 0
  const vol = L * W * D
  const dry = vol * 1.54
  const g = GRADES.find((x) => x[0] === grade)
  const parts = g[1] + g[2] + g[3]
  const cement = Math.ceil(dry * (g[1] / parts) / 0.0347)
  const sand = fmt(dry * (g[2] / parts), 2)
  const agg = fmt(dry * (g[3] / parts), 2)
  return (
    <div className="card tool-card">
      <h3>🏗️ {s.concrete.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.concrete.len}</span><input type="number" value={len} onChange={(e) => setLen(e.target.value)} /></label>
        <label className="field"><span>{s.concrete.width}</span><input type="number" value={wid} onChange={(e) => setWid(e.target.value)} /></label>
        <label className="field"><span>{s.concrete.depth}</span><input type="number" value={dep} onChange={(e) => setDep(e.target.value)} /></label>
        <label className="field"><span>{s.concrete.grade}</span>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>{GRADES.map((x) => <option key={x[0]} value={x[0]}>{x[0]}</option>)}</select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.concrete.vol}</span><b>{fmt(vol, 2)} m³</b></div>
        <div className="row"><span>{s.concrete.cement}</span><b>{cement}</b></div>
        <div className="row"><span>{s.concrete.sand}</span><b>{sand} m³</b></div>
        <div className="row"><span>{s.concrete.agg}</span><b>{agg} m³</b></div>
      </div>
    </div>
  )
}

function Paint({ s }) {
  const [len, setLen] = useState('4')
  const [wid, setWid] = useState('3')
  const [hgt, setHgt] = useState('3')
  const [coats, setCoats] = useState('2')
  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const H = parseFloat(hgt) || 0
  const C = parseInt(coats) || 1
  const wall = 2 * H * (L + W)
  const liters = fmt((wall / 11) * C, 2)
  return (
    <div className="card tool-card">
      <h3>🪣 {s.paint.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.paint.len}</span><input type="number" value={len} onChange={(e) => setLen(e.target.value)} /></label>
        <label className="field"><span>{s.paint.width}</span><input type="number" value={wid} onChange={(e) => setWid(e.target.value)} /></label>
        <label className="field"><span>{s.paint.height}</span><input type="number" value={hgt} onChange={(e) => setHgt(e.target.value)} /></label>
        <label className="field"><span>{s.paint.coats}</span>
          <select value={coats} onChange={(e) => setCoats(e.target.value)}>{[1, 2, 3].map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.paint.wall}</span><b>{fmt(wall, 1)} m²</b></div>
        <div className="row"><span>{s.paint.liters}</span><b>{liters} L</b></div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.paint.tip}</p>
    </div>
  )
}

function Land({ s }) {
  const [val, setVal] = useState('100')
  const [from, setFrom] = useState('sqft')
  const [to, setTo] = useState('sqm')
  const result = fmt((parseFloat(val) || 0) * LAND[from] / LAND[to], 4)
  return (
    <div className="card tool-card">
      <h3>🗺️ {s.land.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.land.value}</span><input type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
        <label className="field"><span>{s.land.to}</span><input type="number" readOnly value={result} /></label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>{LAND_ORDER.map((u) => <option key={u} value={u}>{s.land.units[u]}</option>)}</select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>{LAND_ORDER.map((u) => <option key={u} value={u}>{s.land.units[u]}</option>)}</select>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.land.note}</p>
    </div>
  )
}

// ---------- Engineer ----------

function Resistor({ s }) {
  const [b1, setB1] = useState('brown')
  const [b2, setB2] = useState('black')
  const [b3, setB3] = useState('red')
  const [tol, setTol] = useState('gold')
  const c1 = BAND_COLORS.find((c) => c[0] === b1)
  const c2 = BAND_COLORS.find((c) => c[0] === b2)
  const c3 = BAND_COLORS.find((c) => c[0] === b3)
  const value = (c1[2] * 10 + c2[2]) * MULT[b3]
  return (
    <div className="card tool-card">
      <h3>🎛️ {s.resistor.title}</h3>
      <div className="bands" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
        {[c1, c2, c3].map((c, i) => (
          <div key={i} style={{ width: 46, height: 90, borderRadius: 8, background: c[1], border: '1px solid var(--border)', boxShadow: c[0] === 'white' || c[0] === 'yellow' ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : 'none' }} />
        ))}
      </div>
      <div className="tool-grid">
        <label className="field"><span>{s.resistor.band} 1</span>
          <select value={b1} onChange={(e) => setB1(e.target.value)}>{BAND_COLORS.map((c) => <option key={c[0]} value={c[0]}>{c[0]}</option>)}</select>
        </label>
        <label className="field"><span>{s.resistor.band} 2</span>
          <select value={b2} onChange={(e) => setB2(e.target.value)}>{BAND_COLORS.map((c) => <option key={c[0]} value={c[0]}>{c[0]}</option>)}</select>
        </label>
        <label className="field"><span>{s.resistor.mult}</span>
          <select value={b3} onChange={(e) => setB3(e.target.value)}>{MULT_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}</select>
        </label>
        <label className="field"><span>{s.resistor.tol}</span>
          <select value={tol} onChange={(e) => setTol(e.target.value)}>{TOL_KEYS.map((k) => <option key={k} value={k}>{TOL[k]}</option>)}</select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.resistor.value}</span><b style={{ fontSize: 20 }}>{fmtRes(value)} {TOL[tol]}</b></div>
      </div>
    </div>
  )
}

const VM = { V: 1, mV: 0.001, kV: 1000 }
const IM = { A: 1, mA: 0.001, µA: 0.000001 }
const RM = { Ω: 1, kΩ: 1000, MΩ: 1000000 }

function Ohm({ s }) {
  const [v, setV] = useState('12')
  const [i, setI] = useState('')
  const [r, setR] = useState('')
  const [vu, setVu] = useState('V')
  const [iu, setIu] = useState('A')
  const [ru, setRu] = useState('Ω')
  const nv = parseFloat(v)
  const ni = parseFloat(i)
  const nr = parseFloat(r)
  const hasV = !isNaN(nv)
  const hasI = !isNaN(ni)
  const hasR = !isNaN(nr)
  const V = hasV ? nv * VM[vu] : null
  const I = hasI ? ni * IM[iu] : null
  const R = hasR ? nr * RM[ru] : null
  let out = { v: null, i: null, r: null }
  if ([hasV, hasI, hasR].filter(Boolean).length === 2) {
    if (V !== null && I !== null) out.r = V / I
    if (V !== null && R !== null) out.i = V / R
    if (I !== null && R !== null) out.v = I * R
  }
  return (
    <div className="card tool-card">
      <h3>⚡ {s.ohm.title}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{s.ohm.note}</p>
      <div className="tool-grid">
        <label className="field"><span>{s.ohm.v}</span>
          <div className="unit-row"><input type="number" value={v} onChange={(e) => setV(e.target.value)} />
            <select value={vu} onChange={(e) => setVu(e.target.value)}>{Object.keys(VM).map((u) => <option key={u} value={u}>{u}</option>)}</select>
          </div>
        </label>
        <label className="field"><span>{s.ohm.i}</span>
          <div className="unit-row"><input type="number" value={i} onChange={(e) => setI(e.target.value)} />
            <select value={iu} onChange={(e) => setIu(e.target.value)}>{Object.keys(IM).map((u) => <option key={u} value={u}>{u}</option>)}</select>
          </div>
        </label>
        <label className="field"><span>{s.ohm.r}</span>
          <div className="unit-row"><input type="number" value={r} onChange={(e) => setR(e.target.value)} />
            <select value={ru} onChange={(e) => setRu(e.target.value)}>{Object.keys(RM).map((u) => <option key={u} value={u}>{u}</option>)}</select>
          </div>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.ohm.v}</span><b>{out.v === null ? '—' : fmt(out.v, 4) + ' V'}</b></div>
        <div className="row"><span>{s.ohm.i}</span><b>{out.i === null ? '—' : fmt(out.i, 4) + ' A'}</b></div>
        <div className="row"><span>{s.ohm.r}</span><b>{out.r === null ? '—' : fmt(out.r, 4) + ' Ω'}</b></div>
      </div>
    </div>
  )
}

function Steel({ s }) {
  const [dia, setDia] = useState('12')
  const [len, setLen] = useState('12')
  const [pieces, setPieces] = useState('10')
  const d = parseFloat(dia) || 0
  const L = parseFloat(len) || 0
  const n = parseInt(pieces) || 0
  const perM = fmt((d * d) / 162, 2)
  const total = fmt((d * d) / 162 * L * n, 2)
  return (
    <div className="card tool-card">
      <h3>🔩 {s.steel.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.steel.dia}</span>
          <select value={dia} onChange={(e) => setDia(e.target.value)}>{[8, 10, 12, 16, 20, 25, 32].map((x) => <option key={x} value={x}>{x} mm</option>)}</select>
        </label>
        <label className="field"><span>{s.steel.len}</span><input type="number" value={len} onChange={(e) => setLen(e.target.value)} /></label>
        <label className="field"><span>{s.steel.pieces}</span><input type="number" value={pieces} onChange={(e) => setPieces(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.steel.perM}</span><b>{perM} kg</b></div>
        <div className="row"><span>{s.steel.total}</span><b>{total} kg</b></div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.steel.tip}</p>
    </div>
  )
}

const PUM = {
  v: { V: 1, mV: 0.001, kV: 1000 },
  i: { A: 1, mA: 0.001, µA: 0.000001 },
  p: { W: 1, mW: 0.001, kW: 1000 },
  r: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
}

function Power({ s }) {
  const [vals, setVals] = useState({ v: '', i: '', p: '', r: '' })
  const [units, setUnits] = useState({ v: 'V', i: 'A', p: 'W', r: 'Ω' })
  const set = (k) => (e) => setVals({ ...vals, [k]: e.target.value })
  const setU = (k) => (e) => setUnits({ ...units, [k]: e.target.value })
  const base = {}
  for (const k of ['v', 'i', 'p', 'r']) {
    const n = parseFloat(vals[k])
    base[k] = isNaN(n) ? NaN : n * PUM[k][units[k]]
  }
  const filled = ['v', 'i', 'p', 'r'].filter((k) => !isNaN(parseFloat(vals[k])))
  let out = { v: null, i: null, p: null, r: null }
  if (filled.length === 2) {
    const f = (k) => (filled.includes(k) ? base[k] : null)
    const v = f('v'); const i = f('i'); const p = f('p'); const r = f('r')
    if (v !== null && i !== null) { out.p = v * i; out.r = v / i }
    else if (v !== null && r !== null) { out.i = v / r; out.p = (v * v) / r }
    else if (v !== null && p !== null) { out.i = p / v; out.r = (v * v) / p }
    else if (i !== null && r !== null) { out.v = i * r; out.p = i * i * r }
    else if (i !== null && p !== null) { out.v = p / i; out.r = p / (i * i) }
    else if (p !== null && r !== null) { out.v = Math.sqrt(p * r); out.i = Math.sqrt(p / r) }
  }
  const labels = { v: s.power.v, i: s.power.i, p: s.power.p, r: s.power.r }
  const un = { v: 'V', i: 'A', p: 'W', r: 'Ω' }
  return (
    <div className="card tool-card">
      <h3>🔌 {s.power.title}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>{s.power.note}</p>
      <div className="tool-grid">
        {['v', 'i', 'p', 'r'].map((k) => (
          <label key={k} className="field"><span>{labels[k]}</span>
            <div className="unit-row"><input type="number" value={vals[k]} onChange={set(k)} />
              <select value={units[k]} onChange={setU(k)}>{Object.keys(PUM[k]).map((u) => <option key={u} value={u}>{u}</option>)}</select>
            </div>
          </label>
        ))}
      </div>
      <div className="tool-result">
        {['v', 'i', 'p', 'r'].map((k) => (
          <div key={k} className="row"><span>{labels[k]}</span><b>{out[k] === null ? '—' : fmt(out[k], 4) + ' ' + un[k]}</b></div>
        ))}
      </div>
    </div>
  )
}

// ---------- Health ----------

function BMR({ s }) {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('30')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('170')
  const [act, setAct] = useState('1.55')
  const a = parseFloat(age) || 0
  const w = parseFloat(weight) || 0
  const h = parseFloat(height) || 0
  const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161
  const tdee = bmr * parseFloat(act)
  return (
    <div className="card tool-card">
      <h3>🔥 {s.bmr.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.bmr.gender}</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">{s.bmr.male}</option><option value="female">{s.bmr.female}</option></select>
        </label>
        <label className="field"><span>{s.bmr.age}</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></label>
        <label className="field"><span>{s.bmr.weight}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
        <label className="field"><span>{s.bmr.height}</span><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
        <label className="field" style={{ gridColumn: '1 / -1' }}><span>{s.bmr.activity}</span>
          <select value={act} onChange={(e) => setAct(e.target.value)}>{[1.2, 1.375, 1.55, 1.725, 1.9].map((x, idx) => <option key={x} value={x}>{s.bmr.acts[idx]}</option>)}</select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.bmr.bmr}</span><b>{Math.round(bmr)} kcal</b></div>
        <div className="row"><span>{s.bmr.tdee}</span><b>{Math.round(tdee)} kcal</b></div>
      </div>
    </div>
  )
}

function IdealWt({ s }) {
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('170')
  const h = parseFloat(height) || 0
  const inches = h / 2.54
  const ideal = gender === 'male' ? 50 + 2.3 * (inches - 60) : 45.5 + 2.3 * (inches - 60)
  const m = h / 100
  const lo = 18.5 * m * m
  const hi = 24.9 * m * m
  return (
    <div className="card tool-card">
      <h3>💪 {s.idealwt.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.idealwt.gender}</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">{s.idealwt.male}</option><option value="female">{s.idealwt.female}</option></select>
        </label>
        <label className="field"><span>{s.idealwt.height} (cm)</span><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.idealwt.ideal}</span><b>{fmt(ideal, 1)} kg</b></div>
        <div className="row"><span>{s.idealwt.range}</span><b>{fmt(lo, 1)} – {fmt(hi, 1)} kg</b></div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 10 }}>{s.idealwt.tip}</p>
    </div>
  )
}

function Water({ s }) {
  const [weight, setWeight] = useState('70')
  const w = parseFloat(weight) || 0
  const ml = w * 33
  return (
    <div className="card tool-card">
      <h3>💧 {s.water.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.water.weight}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.water.daily}</span><b>{fmt(ml / 1000, 2)} L</b></div>
        <div className="row"><span>{s.water.glasses}</span><b>{Math.ceil(ml / 250)}</b></div>
      </div>
    </div>
  )
}

function HeartRate({ s }) {
  const [age, setAge] = useState('30')
  const a = parseInt(age) || 0
  const max = 220 - a
  const zones = [
    [0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9],
  ]
  return (
    <div className="card tool-card">
      <h3>❤️ {s.heartrate.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.heartrate.age}</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></label>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '10px 0' }}>{s.heartrate.note}</p>
      <div className="tool-result">
        <div className="row"><span>{s.heartrate.max}</span><b>{max} bpm</b></div>
        {zones.map((z, i) => (
          <div key={i} className="row"><span>{s.heartrate.zones[i]}</span><b>{Math.round(max * z[0])} – {Math.round(max * z[1])} bpm</b></div>
        ))}
      </div>
    </div>
  )
}

// ---------- Finance ----------

function EMI({ s }) {
  const [amount, setAmount] = useState('100000')
  const [rate, setRate] = useState('8.5')
  const [years, setYears] = useState('5')
  const P = parseFloat(amount) || 0
  const r = (parseFloat(rate) || 0) / 1200
  const n = (parseFloat(years) || 0) * 12
  const emi = n && r ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0
  const total = emi * n
  return (
    <div className="card tool-card">
      <h3>🏦 {s.emi.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.emi.amount}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label className="field"><span>{s.emi.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
        <label className="field"><span>{s.emi.years}</span><input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.emi.emi}</span><b>₹ {money(emi)}</b></div>
        <div className="row"><span>{s.emi.interest}</span><b>₹ {money(total - P)}</b></div>
        <div className="row"><span>{s.emi.total}</span><b>₹ {money(total)}</b></div>
      </div>
    </div>
  )
}

function SIP({ s }) {
  const [monthly, setMonthly] = useState('5000')
  const [rate, setRate] = useState('12')
  const [years, setYears] = useState('10')
  const P = parseFloat(monthly) || 0
  const i = (parseFloat(rate) || 0) / 1200
  const n = (parseFloat(years) || 0) * 12
  const fv = n && i ? P * (Math.pow(1 + i, n) - 1) / i * (1 + i) : 0
  const invested = P * n
  return (
    <div className="card tool-card">
      <h3>📈 {s.sip.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.sip.monthly}</span><input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></label>
        <label className="field"><span>{s.sip.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
        <label className="field"><span>{s.sip.years}</span><input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.sip.invested}</span><b>₹ {money(invested)}</b></div>
        <div className="row"><span>{s.sip.gains}</span><b>₹ {money(fv - invested)}</b></div>
        <div className="row"><span>{s.sip.value}</span><b>₹ {money(fv)}</b></div>
      </div>
    </div>
  )
}

function GST({ s }) {
  const [amount, setAmount] = useState('1000')
  const [rate, setRate] = useState('18')
  const [mode, setMode] = useState('add')
  const amt = parseFloat(amount) || 0
  const r = parseFloat(rate) || 0
  const tax = mode === 'add' ? amt * r / 100 : amt - amt * 100 / (100 + r)
  const total = mode === 'add' ? amt + tax : amt
  return (
    <div className="card tool-card">
      <h3>🧾 {s.gst.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.gst.amount}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label className="field"><span>{s.gst.rate}</span>
          <select value={rate} onChange={(e) => setRate(e.target.value)}>{[0, 5, 12, 18, 28].map((x) => <option key={x} value={x}>{x}%</option>)}</select>
        </label>
        <label className="field"><span>{s.gst.mode}</span>
          <select value={mode} onChange={(e) => setMode(e.target.value)}><option value="add">{s.gst.add}</option><option value="excl">{s.gst.excl}</option></select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.gst.tax}</span><b>₹ {money(tax)}</b></div>
        <div className="row"><span>{s.gst.total}</span><b>₹ {money(total)}</b></div>
      </div>
    </div>
  )
}

function Interest({ s }) {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('6')
  const [years, setYears] = useState('3')
  const [type, setType] = useState('compound')
  const P = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const t = parseFloat(years) || 0
  const total = type === 'simple' ? P + (P * r * t) / 100 : P * Math.pow(1 + r / 100, t)
  return (
    <div className="card tool-card">
      <h3>💹 {s.interest.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.interest.principal}</span><input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></label>
        <label className="field"><span>{s.interest.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
        <label className="field"><span>{s.interest.years}</span><input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></label>
        <label className="field"><span>{s.interest.type}</span>
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="simple">{s.interest.simple}</option><option value="compound">{s.interest.compound}</option></select>
        </label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.interest.total}</span><b>₹ {money(total)}</b></div>
        <div className="row"><span>{s.interest.interest}</span><b>₹ {money(total - P)}</b></div>
      </div>
    </div>
  )
}

// ---------- Everyday ----------

function Percent({ s }) {
  const [x, setX] = useState('20')
  const [y, setY] = useState('500')
  const [price, setPrice] = useState('2000')
  const [dc, setDc] = useState('10')
  const result = (parseFloat(x) || 0) * (parseFloat(y) || 0) / 100
  const final = (parseFloat(price) || 0) * (1 - (parseFloat(dc) || 0) / 100)
  const saved = (parseFloat(price) || 0) - final
  return (
    <div className="card tool-card">
      <h3>💯 {s.percent.title}</h3>
      <h4 style={{ fontSize: 15, margin: '4px 0 10px', color: 'var(--text-dim)' }}>{s.percent.xOfY}</h4>
      <div className="tool-grid">
        <label className="field"><span>{s.percent.x}</span><input type="number" value={x} onChange={(e) => setX(e.target.value)} /></label>
        <label className="field"><span>{s.percent.y}</span><input type="number" value={y} onChange={(e) => setY(e.target.value)} /></label>
      </div>
      <div className="tool-result" style={{ marginBottom: 16 }}>
        <div className="row"><span>{s.percent.result}</span><b>{fmt(result, 2)}</b></div>
      </div>
      <h4 style={{ fontSize: 15, margin: '4px 0 10px', color: 'var(--text-dim)' }}>{s.percent.disc}</h4>
      <div className="tool-grid">
        <label className="field"><span>{s.percent.price}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <label className="field"><span>{s.percent.dc}</span><input type="number" value={dc} onChange={(e) => setDc(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.percent.final}</span><b>₹ {money(final)}</b></div>
        <div className="row"><span>{s.percent.saved}</span><b>₹ {money(saved)}</b></div>
      </div>
    </div>
  )
}

function Age({ s }) {
  const [dob, setDob] = useState('')
  const [out, setOut] = useState(null)
  const calc = () => {
    if (!dob) return
    const a = new Date(dob)
    const b = new Date()
    if (isNaN(a.getTime()) || a > b) return
    let years = b.getFullYear() - a.getFullYear()
    let months = b.getMonth() - a.getMonth()
    let days = b.getDate() - a.getDate()
    if (days < 0) { months--; days += new Date(b.getFullYear(), b.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const total = Math.floor((b - a) / 86400000)
    setOut({ years, months, days, total })
  }
  return (
    <div className="card tool-card">
      <h3>🎂 {s.age.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.age.dob}</span><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></label>
        <button className="btn btn-primary" style={{ alignSelf: 'end' }} onClick={calc}>{s.age.calc}</button>
      </div>
      {out && (
        <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div><b>{out.years}</b><span>{s.age.years}</span></div>
          <div><b>{out.months}</b><span>{s.age.months}</span></div>
          <div><b>{out.days}</b><span>{s.age.days}</span></div>
        </div>
      )}
      {out && (
        <div className="tool-result" style={{ marginTop: 12 }}>
          <div className="row"><span>{s.age.total}</span><b>{out.total.toLocaleString('en-IN')}</b></div>
        </div>
      )}
    </div>
  )
}

function DateDiff({ s }) {
  const [d1, setD1] = useState('')
  const [d2, setD2] = useState('')
  const [out, setOut] = useState(null)
  const calc = () => {
    if (!d1 || !d2) return
    const a = new Date(d1)
    const b = new Date(d2)
    const days = Math.abs(Math.round((b - a) / 86400000))
    setOut({ days, weeks: fmt(days / 7, 1), months: fmt(days / 30.44, 1) })
  }
  return (
    <div className="card tool-card">
      <h3>📆 {s.datediff.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.datediff.from}</span><input type="date" value={d1} onChange={(e) => setD1(e.target.value)} /></label>
        <label className="field"><span>{s.datediff.to}</span><input type="date" value={d2} onChange={(e) => setD2(e.target.value)} /></label>
        <button className="btn btn-primary" style={{ gridColumn: '1 / -1' }} onClick={calc}>{s.datediff.calc}</button>
      </div>
      {out && (
        <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div><b>{out.days.toLocaleString('en-IN')}</b><span>{s.datediff.days}</span></div>
          <div><b>{out.weeks}</b><span>{s.datediff.weeks}</span></div>
          <div><b>{out.months}</b><span>{s.datediff.months}</span></div>
        </div>
      )}
    </div>
  )
}

function Fuel({ s }) {
  const [dist, setDist] = useState('100')
  const [mileage, setMileage] = useState('18')
  const [price, setPrice] = useState('95')
  const d = parseFloat(dist) || 0
  const m = parseFloat(mileage) || 0
  const p = parseFloat(price) || 0
  const liters = fmt(d / m, 2)
  const cost = fmt(d / m * p, 0)
  return (
    <div className="card tool-card">
      <h3>⛽ {s.fuel.title}</h3>
      <div className="tool-grid">
        <label className="field"><span>{s.fuel.dist}</span><input type="number" value={dist} onChange={(e) => setDist(e.target.value)} /></label>
        <label className="field"><span>{s.fuel.mileage}</span><input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} /></label>
        <label className="field"><span>{s.fuel.price}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
      </div>
      <div className="tool-result">
        <div className="row"><span>{s.fuel.liters}</span><b>{liters} L</b></div>
        <div className="row"><span>{s.fuel.cost}</span><b>₹ {money(cost)}</b></div>
      </div>
    </div>
  )
}

export const PRO_RENDER = {
  brick: Brick, concrete: Concrete, paint: Paint, land: Land,
  resistor: Resistor, ohm: Ohm, steel: Steel, power: Power,
  bmr: BMR, idealwt: IdealWt, water: Water, heartrate: HeartRate,
  emi: EMI, sip: SIP, gst: GST, interest: Interest,
  percent: Percent, age: Age, datediff: DateDiff, fuel: Fuel,
}
