import { useRef, useState } from 'react'

const fmt = (n, d = 4) => (isNaN(n) || !isFinite(n) ? '' : +Number(n).toFixed(d))
const money = (n) => (isNaN(n) ? '0' : Math.round(n).toLocaleString('en-IN'))
const Res = ({ rows }) => (
  <div className="tool-result">{rows.map((r, i) => <div key={i} className="row"><span>{r[0]}</span><b>{r[1]}</b></div>)}</div>
)

export const P3_CATEGORIES = [
  { id: 'business', icon: '🏪', tools: ['profit', 'markup', 'breakeven', 'roi', 'change', 'unitprice', 'commission', 'billsplit'] },
  { id: 'fitness', icon: '🏃', tools: ['macros', 'onerm', 'pace', 'steps', 'deficit', 'bodyfat'] },
  { id: 'developer', icon: '💻', tools: ['baseconv', 'hexrgb', 'ascii', 'base64', 'urlcode', 'jsonfmt', 'subnet', 'storage'] },
  { id: 'farmer', icon: '🧑‍🌾', tools: ['seed', 'fertilizer', 'pesticide', 'yield'] },
  { id: 'music', icon: '🎵', tools: ['metronome', 'bpmms', 'notefreq', 'interval'] },
]

export const P3_TAB = {
  profit: '💰', markup: '🏷️', breakeven: '⚖️', roi: '🎯', change: '💵', unitprice: '🔎', commission: '🤝', billsplit: '💳',
  macros: '🥗', onerm: '🏋️', pace: '🏃', steps: '👟', deficit: '⏳', bodyfat: '🧮',
  baseconv: '💽', hexrgb: '🎨', ascii: '🔣', base64: '🅱️', urlcode: '🔗', jsonfmt: '📄', subnet: '🕸️', storage: '💾',
  seed: '🌱', fertilizer: '🌾', pesticide: '🧪', yield: '🚜',
  metronome: '🥁', bpmms: '🎵', notefreq: '🎼', interval: '🎶',
}

export const P3_STRINGS = {
  en: {
    cats: { business: 'Business', fitness: 'Fitness', developer: 'Developer', farmer: 'Farmer', music: 'Music' },
    tabs: {
      profit: 'Profit', markup: 'Markup', breakeven: 'Break-even', roi: 'ROI', change: 'Change', unitprice: 'Unit Price', commission: 'Commission', billsplit: 'Bill Split',
      macros: 'Macros', onerm: '1RM', pace: 'Pace', steps: 'Steps', deficit: 'Deficit', bodyfat: 'Body Fat',
      baseconv: 'Base Conv', hexrgb: 'HEX/RGB', ascii: 'ASCII', base64: 'Base64', urlcode: 'URL', jsonfmt: 'JSON', subnet: 'Subnet', storage: 'Storage',
      seed: 'Seed', fertilizer: 'Fertilizer', pesticide: 'Pesticide', yield: 'Yield',
      metronome: 'Metronome', bpmms: 'BPM→ms', notefreq: 'Note Freq', interval: 'Interval',
    },
    profit: { title: 'Profit & Loss', cp: 'Cost price (₹)', sp: 'Selling price (₹)', amt: 'Profit / Loss', pct: 'Profit / Loss %' },
    markup: { title: 'Markup & Margin', cp: 'Cost price (₹)', sp: 'Selling price (₹)', markup: 'Markup %', margin: 'Margin %' },
    breakeven: { title: 'Break-even Point', fc: 'Fixed costs (₹)', price: 'Price per unit (₹)', vc: 'Variable cost / unit (₹)', units: 'Break-even units', rev: 'Break-even revenue' },
    roi: { title: 'ROI Calculator', invest: 'Investment (₹)', final: 'Final value (₹)', profit: 'Profit (₹)', roi: 'ROI %' },
    change: { title: 'Change Maker', bill: 'Bill amount (₹)', paid: 'Amount paid (₹)', change: 'Change to give', breakdown: 'Breakdown' },
    unitprice: { title: 'Unit Price Compare', p1: 'Price A', q1: 'Qty A', p2: 'Price B', q2: 'Qty B', up1: 'Price A per unit', up2: 'Price B per unit', better: 'Better deal' },
    commission: { title: 'Commission', amount: 'Sale amount (₹)', rate: 'Rate (%)', comm: 'Commission' },
    billsplit: { title: 'Bill Splitter', total: 'Bill total (₹)', tax: 'Tax (%)', tip: 'Tip (%)', people: 'People', per: 'Per person' },
    macros: { title: 'Daily Macros', gender: 'Gender', male: 'Male', female: 'Female', age: 'Age', weight: 'Weight (kg)', height: 'Height (cm)', activity: 'Activity', goal: 'Goal', lose: 'Lose fat', keep: 'Maintain', gain: 'Build muscle', cal: 'Daily calories', protein: 'Protein (g)', fat: 'Fat (g)', carbs: 'Carbs (g)' },
    onerm: { title: '1 Rep Max', weight: 'Weight lifted (kg)', reps: 'Reps', est: 'Estimated 1RM' },
    pace: { title: 'Running Pace', dist: 'Distance (km)', min: 'Minutes', sec: 'Seconds', pace: 'Pace (min/km)', speed: 'Speed (km/h)' },
    steps: { title: 'Steps to Distance', steps: 'Steps', stride: 'Stride length (cm)', km: 'Distance (km)', mi: 'Distance (miles)', kcal: 'Approx. calories' },
    deficit: { title: 'Calorie Deficit Plan', cw: 'Current weight (kg)', gw: 'Goal weight (kg)', weeks: 'Weeks to goal', total: 'Total deficit (kcal)', daily: 'Daily deficit needed', at500: 'Weeks at −500 kcal/day' },
    bodyfat: { title: 'Body Fat %', age: 'Age', gender: 'Gender', male: 'Male', female: 'Female', weight: 'Weight (kg)', height: 'Height (cm)', bmi: 'BMI', bf: 'Body fat %', cat: 'Category' },
    baseconv: { title: 'Base Converter', num: 'Number', from: 'From base', dec: 'Decimal', bin: 'Binary', oct: 'Octal', hex: 'Hex' },
    hexrgb: { title: 'HEX ↔ RGB', hex: 'HEX', r: 'Red', g: 'Green', b: 'Blue', out: 'HEX' },
    ascii: { title: 'ASCII Table', char: 'Character', code: 'ASCII code', note: 'Type a character or a code' },
    base64: { title: 'Base64 Encode / Decode', text: 'Text', enc: 'Encode', dec: 'Decode', out: 'Result' },
    urlcode: { title: 'URL Encode / Decode', text: 'Text / URL', enc: 'Encode', dec: 'Decode', out: 'Result' },
    jsonfmt: { title: 'JSON Formatter', paste: 'Paste JSON here…', fmt: 'Format', err: 'Invalid JSON', out: 'Pretty JSON' },
    subnet: { title: 'IP Subnet Calculator', ip: 'IP address', prefix: 'Prefix (/n)', net: 'Network', mask: 'Subnet mask', bc: 'Broadcast', hosts: 'Usable hosts', range: 'Usable range' },
    storage: { title: 'Storage Converter', value: 'Value', unit: 'Unit', out: 'All units' },
    seed: { title: 'Seed Rate Calculator', area: 'Area (acres)', rate: 'Seed rate (kg/acre)', germ: 'Germination (%)', need: 'Seed needed (kg)', adj: 'Adjusted for germination' },
    fertilizer: { title: 'Fertilizer Calculator', area: 'Area (acres)', target: 'Target N (kg/acre)', grade: 'Fertilizer N %', need: 'Fertilizer needed (kg)', bags: 'Bags (50 kg)' },
    pesticide: { title: 'Pesticide Mix', tank: 'Water tank (liters)', dose: 'Dose (ml per liter)', need: 'Pesticide needed (ml)' },
    yield: { title: 'Crop Yield', area: 'Area (acres)', per: 'Yield per acre (kg)', price: 'Price per kg (₹)', total: 'Total yield (kg)', value: 'Total value' },
    metronome: { title: 'Metronome', bpm: 'BPM', start: 'Start', stop: 'Stop', beat: 'Beat' },
    bpmms: { title: 'BPM ↔ ms', bpm: 'BPM', ms: 'ms', whole: 'Whole', half: 'Half', quarter: 'Quarter', eighth: 'Eighth', sixteenth: 'Sixteenth' },
    notefreq: { title: 'Note Frequency', note: 'Note', freq: 'Frequency (Hz)', or: 'or', fromFreq: 'Frequency → Note' },
    interval: { title: 'Interval Finder', n1: 'Note 1', n2: 'Note 2', semis: 'Semitones', name: 'Interval' },
  },
  hi: {
    cats: { business: 'व्यापार', fitness: 'फिटनेस', developer: 'डेवलपर', farmer: 'किसान', music: 'संगीत' },
    tabs: {
      profit: 'लाभ', markup: 'मार्कअप', breakeven: 'ब्रेक-ईवन', roi: 'ROI', change: 'छुट्टा', unitprice: 'यूनिट मूल्य', commission: 'कमीशन', billsplit: 'बिल बांटें',
      macros: 'मैक्रोज़', onerm: '1RM', pace: 'गति', steps: 'कदम', deficit: 'कटौती', bodyfat: 'शरीर में चर्बी',
      baseconv: 'बेस कन्वर्ट', hexrgb: 'HEX/RGB', ascii: 'ASCII', base64: 'Base64', urlcode: 'URL', jsonfmt: 'JSON', subnet: 'सबनेट', storage: 'स्टोरेज',
      seed: 'बीज', fertilizer: 'खाद', pesticide: 'कीटनाशक', yield: 'उपज',
      metronome: 'मेट्रोनोम', bpmms: 'BPM→ms', notefreq: 'नोट फ्रीक्वेंसी', interval: 'अंतराल',
    },
    profit: { title: 'लाभ और हानि', cp: 'क्रय मूल्य (₹)', sp: 'विक्रय मूल्य (₹)', amt: 'लाभ / हानि', pct: 'लाभ / हानि %' },
    markup: { title: 'मार्कअप और मार्जिन', cp: 'क्रय मूल्य (₹)', sp: 'विक्रय मूल्य (₹)', markup: 'मार्कअप %', margin: 'मार्जिन %' },
    breakeven: { title: 'ब्रेक-ईवन बिंदु', fc: 'फिक्स लागत (₹)', price: 'प्रति यूनिट मूल्य (₹)', vc: 'परिवर्तनीय लागत / यूनिट (₹)', units: 'ब्रेक-ईवन यूनिट', rev: 'ब्रेक-ईवन आमदनी' },
    roi: { title: 'ROI कैलकुलेटर', invest: 'निवेश (₹)', final: 'अंतिम मूल्य (₹)', profit: 'लाभ (₹)', roi: 'ROI %' },
    change: { title: 'छुट्टा निकालें', bill: 'बिल राशि (₹)', paid: 'दी गई राशि (₹)', change: 'वापसी राशि', breakdown: 'विवरण' },
    unitprice: { title: 'यूनिट मूल्य तुलना', p1: 'मूल्य A', q1: 'मात्रा A', p2: 'मूल्य B', q2: 'मात्रा B', up1: 'A प्रति यूनिट', up2: 'B प्रति यूनिट', better: 'बेहतर सौदा' },
    commission: { title: 'कमीशन', amount: 'बिक्री राशि (₹)', rate: 'दर (%)', comm: 'कमीशन' },
    billsplit: { title: 'बिल स्प्लिटर', total: 'कुल बिल (₹)', tax: 'टैक्स (%)', tip: 'टिप (%)', people: 'लोग', per: 'प्रति व्यक्ति' },
    macros: { title: 'दैनिक मैक्रोज़', gender: 'लिंग', male: 'पुरुष', female: 'महिला', age: 'उम्र', weight: 'वज़न (किलो)', height: 'लंबाई (सेमी)', activity: 'गतिविधि', goal: 'लक्ष्य', lose: 'चर्बी घटाएं', keep: 'बनाए रखें', gain: 'मसल बढ़ाएं', cal: 'दैनिक कैलोरी', protein: 'प्रोटीन (ग्राम)', fat: 'वसा (ग्राम)', carbs: 'कार्ब्स (ग्राम)' },
    onerm: { title: '1 रेप मैक्स', weight: 'उठाया वज़न (किलो)', reps: 'रेप्स', est: 'अनुमानित 1RM' },
    pace: { title: 'दौड़ गति', dist: 'दूरी (किमी)', min: 'मिनट', sec: 'सेकंड', pace: 'गति (मिनट/किमी)', speed: 'चाल (किमी/घं)' },
    steps: { title: 'कदम से दूरी', steps: 'कदम', stride: 'कदम लंबाई (सेमी)', km: 'दूरी (किमी)', mi: 'दूरी (मील)', kcal: 'अनुमानित कैलोरी' },
    deficit: { title: 'कैलोरी कटौती योजना', cw: 'वर्तमान वज़न (किलो)', gw: 'लक्ष्य वज़न (किलो)', weeks: 'लक्ष्य तक हफ्ते', total: 'कुल कटौती (kcal)', daily: 'दैनिक कटौती चाहिए', at500: '−500 kcal/दिन पर हफ्ते' },
    bodyfat: { title: 'शरीर में चर्बी %', age: 'उम्र', gender: 'लिंग', male: 'पुरुष', female: 'महिला', weight: 'वज़न (किलो)', height: 'लंबाई (सेमी)', bmi: 'BMI', bf: 'चर्बी %', cat: 'श्रेणी' },
    baseconv: { title: 'बेस कन्वर्टर', num: 'संख्या', from: 'आधार', dec: 'दशमलव', bin: 'बाइनरी', oct: 'ऑक्टल', hex: 'हेक्स' },
    hexrgb: { title: 'HEX ↔ RGB', hex: 'HEX', r: 'लाल', g: 'हरा', b: 'नीला', out: 'HEX' },
    ascii: { title: 'ASCII तालिका', char: 'अक्षर', code: 'ASCII कोड', note: 'अक्षर या कोड टाइप करें' },
    base64: { title: 'Base64 एन्कोड / डिकोड', text: 'टेक्स्ट', enc: 'एन्कोड', dec: 'डिकोड', out: 'परिणाम' },
    urlcode: { title: 'URL एन्कोड / डिकोड', text: 'टेक्स्ट / URL', enc: 'एन्कोड', dec: 'डिकोड', out: 'परिणाम' },
    jsonfmt: { title: 'JSON फॉर्मेटर', paste: 'यहां JSON चिपकाएं…', fmt: 'फॉर्मेट', err: 'गलत JSON', out: 'सुंदर JSON' },
    subnet: { title: 'IP सबनेट कैलकुलेटर', ip: 'IP पता', prefix: 'प्रीफिक्स (/n)', net: 'नेटवर्क', mask: 'सबनेट मास्क', bc: 'ब्रॉडकास्ट', hosts: 'उपयोगी होस्ट', range: 'उपयोगी सीमा' },
    storage: { title: 'स्टोरेज कन्वर्टर', value: 'मान', unit: 'यूनिट', out: 'सभी यूनिट' },
    seed: { title: 'बीज दर कैलकुलेटर', area: 'क्षेत्र (एकड़)', rate: 'बीज दर (किलो/एकड़)', germ: 'अंकुरण (%)', need: 'बीज चाहिए (किलो)', adj: 'अंकुरण के हिसाब से' },
    fertilizer: { title: 'खाद कैलकुलेटर', area: 'क्षेत्र (एकड़)', target: 'लक्ष्य N (किलो/एकड़)', grade: 'खाद में N %', need: 'खाद चाहिए (किलो)', bags: 'बोरे (50 किलो)' },
    pesticide: { title: 'कीटनाशक मिश्रण', tank: 'पानी टैंक (लीटर)', dose: 'मात्रा (मिली प्रति लीटर)', need: 'कीटनाशक (मिली)' },
    yield: { title: 'फसल उपज', area: 'क्षेत्र (एकड़)', per: 'उपज प्रति एकड़ (किलो)', price: 'मूल्य प्रति किलो (₹)', total: 'कुल उपज (किलो)', value: 'कुल मूल्य' },
    metronome: { title: 'मेट्रोनोम', bpm: 'BPM', start: 'शुरू', stop: 'रोकें', beat: 'बीट' },
    bpmms: { title: 'BPM ↔ ms', bpm: 'BPM', ms: 'ms', whole: 'पूरा', half: 'आधा', quarter: 'चौथाई', eighth: 'आठवां', sixteenth: 'सोलहवां' },
    notefreq: { title: 'नोट फ्रीक्वेंसी', note: 'नोट', freq: 'फ्रीक्वेंसी (Hz)', or: 'या', fromFreq: 'फ्रीक्वेंसी → नोट' },
    interval: { title: 'अंतराल पहचान', n1: 'नोट 1', n2: 'नोट 2', semis: 'सेमीटोन', name: 'अंतराल' },
  },
}

// ---------- Business ----------

function Profit({ s }) {
  const [cp, setCp] = useState('500')
  const [sp, setSp] = useState('650')
  const C = parseFloat(cp) || 0; const S = parseFloat(sp) || 0
  const diff = S - C
  const pct = C ? Math.abs(diff) / C * 100 : 0
  return <div className="card tool-card"><h3>💰 {s.profit.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.profit.cp}</span><input type="number" value={cp} onChange={(e) => setCp(e.target.value)} /></label>
      <label className="field"><span>{s.profit.sp}</span><input type="number" value={sp} onChange={(e) => setSp(e.target.value)} /></label>
    </div>
    <Res rows={[[s.profit.amt, (diff >= 0 ? '✅ +' : '❌ −') + '₹ ' + money(Math.abs(diff))], [s.profit.pct, fmt(pct, 2) + '%']]} />
  </div>
}

function Markup({ s }) {
  const [cp, setCp] = useState('400')
  const [sp, setSp] = useState('600')
  const C = parseFloat(cp) || 0; const S = parseFloat(sp) || 0
  const markup = C ? (S - C) / C * 100 : 0
  const margin = S ? (S - C) / S * 100 : 0
  return <div className="card tool-card"><h3>🏷️ {s.markup.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.markup.cp}</span><input type="number" value={cp} onChange={(e) => setCp(e.target.value)} /></label>
      <label className="field"><span>{s.markup.sp}</span><input type="number" value={sp} onChange={(e) => setSp(e.target.value)} /></label>
    </div>
    <Res rows={[[s.markup.markup, fmt(markup, 1) + '%'], [s.markup.margin, fmt(margin, 1) + '%']]} />
  </div>
}

function Breakeven({ s }) {
  const [fc, setFc] = useState('50000')
  const [price, setPrice] = useState('100')
  const [vc, setVc] = useState('60')
  const F = parseFloat(fc) || 0; const P = parseFloat(price) || 0; const V = parseFloat(vc) || 0
  const units = P > V ? F / (P - V) : 0
  return <div className="card tool-card"><h3>⚖️ {s.breakeven.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.breakeven.fc}</span><input type="number" value={fc} onChange={(e) => setFc(e.target.value)} /></label>
      <label className="field"><span>{s.breakeven.price}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
      <label className="field"><span>{s.breakeven.vc}</span><input type="number" value={vc} onChange={(e) => setVc(e.target.value)} /></label>
    </div>
    <Res rows={[[s.breakeven.units, Math.ceil(units)], [s.breakeven.rev, '₹ ' + money(Math.ceil(units) * P)]]} />
  </div>
}

function ROI({ s }) {
  const [invest, setInvest] = useState('100000')
  const [final, setFinal] = useState('130000')
  const I = parseFloat(invest) || 0; const F = parseFloat(final) || 0
  const profit = F - I
  const roi = I ? profit / I * 100 : 0
  return <div className="card tool-card"><h3>🎯 {s.roi.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.roi.invest}</span><input type="number" value={invest} onChange={(e) => setInvest(e.target.value)} /></label>
      <label className="field"><span>{s.roi.final}</span><input type="number" value={final} onChange={(e) => setFinal(e.target.value)} /></label>
    </div>
    <Res rows={[[s.roi.profit, '₹ ' + money(profit)], [s.roi.roi, fmt(roi, 1) + '%']]} />
  </div>
}

const DENOMS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
function Change({ s }) {
  const [bill, setBill] = useState('450')
  const [paid, setPaid] = useState('1000')
  const change = Math.max(0, (parseFloat(paid) || 0) - (parseFloat(bill) || 0))
  let rem = Math.round(change)
  const parts = {}
  for (const d of DENOMS) { parts[d] = Math.floor(rem / d); rem %= d }
  return <div className="card tool-card"><h3>💵 {s.change.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.change.bill}</span><input type="number" value={bill} onChange={(e) => setBill(e.target.value)} /></label>
      <label className="field"><span>{s.change.paid}</span><input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} /></label>
    </div>
    <Res rows={[[s.change.change, '₹ ' + money(change)]]} />
    <div className="counter-stats" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
      {DENOMS.filter((d) => parts[d] > 0).map((d) => <div key={d}><b style={{ fontSize: 14 }}>{parts[d]}</b><span>₹{d}</span></div>)}
    </div>
  </div>
}

function UnitPrice({ s }) {
  const [p1, setP1] = useState('100')
  const [q1, setQ1] = useState('500')
  const [p2, setP2] = useState('80')
  const [q2, setQ2] = useState('300')
  const qA = parseFloat(q1) || 0
  const qB = parseFloat(q2) || 0
  const u1 = qA ? (parseFloat(p1) || 0) / qA : 0
  const u2 = qB ? (parseFloat(p2) || 0) / qB : 0
  const better = u1 === 0 || u2 === 0 ? '—' : u1 <= u2 ? 'A' : 'B'
  return <div className="card tool-card"><h3>🔎 {s.unitprice.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.unitprice.p1}</span><input type="number" value={p1} onChange={(e) => setP1(e.target.value)} /></label>
      <label className="field"><span>{s.unitprice.q1}</span><input type="number" value={q1} onChange={(e) => setQ1(e.target.value)} /></label>
      <label className="field"><span>{s.unitprice.p2}</span><input type="number" value={p2} onChange={(e) => setP2(e.target.value)} /></label>
      <label className="field"><span>{s.unitprice.q2}</span><input type="number" value={q2} onChange={(e) => setQ2(e.target.value)} /></label>
    </div>
    <Res rows={[[s.unitprice.up1, '₹ ' + fmt(u1, 3)], [s.unitprice.up2, '₹ ' + fmt(u2, 3)], [s.unitprice.better, better === '—' ? '—' : better + ' ✔']]} />
  </div>
}

function Commission({ s }) {
  const [amount, setAmount] = useState('50000')
  const [rate, setRate] = useState('5')
  const comm = (parseFloat(amount) || 0) * (parseFloat(rate) || 0) / 100
  return <div className="card tool-card"><h3>🤝 {s.commission.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.commission.amount}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
      <label className="field"><span>{s.commission.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
    </div>
    <Res rows={[[s.commission.comm, '₹ ' + money(comm)]]} />
  </div>
}

function BillSplit({ s }) {
  const [total, setTotal] = useState('1500')
  const [tax, setTax] = useState('18')
  const [tip, setTip] = useState('10')
  const [people, setPeople] = useState('3')
  const T = parseFloat(total) || 0
  const taxAmt = T * (parseFloat(tax) || 0) / 100
  const tipAmt = (T + taxAmt) * (parseFloat(tip) || 0) / 100
  const per = Math.max(1, parseInt(people) || 1)
  return <div className="card tool-card"><h3>💳 {s.billsplit.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.billsplit.total}</span><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} /></label>
      <label className="field"><span>{s.billsplit.tax}</span><input type="number" value={tax} onChange={(e) => setTax(e.target.value)} /></label>
      <label className="field"><span>{s.billsplit.tip}</span><input type="number" value={tip} onChange={(e) => setTip(e.target.value)} /></label>
      <label className="field"><span>{s.billsplit.people}</span><input type="number" value={people} onChange={(e) => setPeople(e.target.value)} /></label>
    </div>
    <Res rows={[[s.billsplit.per, '₹ ' + fmt((T + taxAmt + tipAmt) / per, 2)]]} />
  </div>
}

// ---------- Fitness ----------

const ACTIVITY = [1.2, 1.375, 1.55, 1.725, 1.9]
function Macros({ s }) {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('28')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('170')
  const [act, setAct] = useState('1.55')
  const [goal, setGoal] = useState('keep')
  const a = parseFloat(age) || 0; const w = parseFloat(weight) || 0; const h = parseFloat(height) || 0
  const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161
  let cal = bmr * parseFloat(act)
  if (goal === 'lose') cal *= 0.8
  if (goal === 'gain') cal *= 1.15
  const protein = w * 1.8
  const fat = cal * 0.25 / 9
  const carbs = (cal - protein * 4 - fat * 9) / 4
  return <div className="card tool-card"><h3>🥗 {s.macros.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.macros.gender}</span>
        <select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">{s.macros.male}</option><option value="female">{s.macros.female}</option></select>
      </label>
      <label className="field"><span>{s.macros.age}</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></label>
      <label className="field"><span>{s.macros.weight}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
      <label className="field"><span>{s.macros.height}</span><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
      <label className="field"><span>{s.macros.activity}</span>
        <select value={act} onChange={(e) => setAct(e.target.value)}>{ACTIVITY.map((x) => <option key={x} value={x}>{x}</option>)}</select>
      </label>
      <label className="field"><span>{s.macros.goal}</span>
        <select value={goal} onChange={(e) => setGoal(e.target.value)}><option value="lose">{s.macros.lose}</option><option value="keep">{s.macros.keep}</option><option value="gain">{s.macros.gain}</option></select>
      </label>
    </div>
    <Res rows={[[s.macros.cal, Math.round(cal) + ' kcal'], [s.macros.protein, Math.round(protein) + ' g'], [s.macros.fat, Math.round(fat) + ' g'], [s.macros.carbs, Math.round(carbs) + ' g']]} />
  </div>
}

function OneRM({ s }) {
  const [weight, setWeight] = useState('80')
  const [reps, setReps] = useState('5')
  const w = parseFloat(weight) || 0; const r = parseInt(reps) || 0
  const est = r ? w * (1 + r / 30) : 0
  return <div className="card tool-card"><h3>🏋️ {s.onerm.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.onerm.weight}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
      <label className="field"><span>{s.onerm.reps}</span><input type="number" value={reps} onChange={(e) => setReps(e.target.value)} /></label>
    </div>
    <Res rows={[[s.onerm.est, fmt(est, 1) + ' kg']]} />
  </div>
}

function Pace({ s }) {
  const [dist, setDist] = useState('10')
  const [min, setMin] = useState('50')
  const [sec, setSec] = useState('0')
  const d = parseFloat(dist) || 0
  const totalMin = (parseInt(min) || 0) + (parseInt(sec) || 0) / 60
  const pace = d ? totalMin / d : 0
  const speed = totalMin ? d / (totalMin / 60) : 0
  const pm = Math.floor(pace); const ps = Math.round((pace - pm) * 60)
  return <div className="card tool-card"><h3>🏃 {s.pace.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.pace.dist}</span><input type="number" value={dist} onChange={(e) => setDist(e.target.value)} /></label>
      <label className="field"><span>{s.pace.min}</span><input type="number" value={min} onChange={(e) => setMin(e.target.value)} /></label>
      <label className="field"><span>{s.pace.sec}</span><input type="number" value={sec} onChange={(e) => setSec(e.target.value)} /></label>
    </div>
    <Res rows={[[s.pace.pace, `${String(pm).padStart(2, '0')}:${String(ps).padStart(2, '0')} /km`], [s.pace.speed, fmt(speed, 2) + ' km/h']]} />
  </div>
}

function Steps({ s }) {
  const [steps, setSteps] = useState('10000')
  const [stride, setStride] = useState('78')
  const st = parseInt(steps) || 0; const sd = parseFloat(stride) || 0
  const km = st * sd / 100000
  return <div className="card tool-card"><h3>👟 {s.steps.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.steps.steps}</span><input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} /></label>
      <label className="field"><span>{s.steps.stride}</span><input type="number" value={stride} onChange={(e) => setStride(e.target.value)} /></label>
    </div>
    <Res rows={[[s.steps.km, fmt(km, 2) + ' km'], [s.steps.mi, fmt(km * 0.621371, 2) + ' mi'], [s.steps.kcal, Math.round(st * 0.04)]]} />
  </div>
}

function Deficit({ s }) {
  const [cw, setCw] = useState('80')
  const [gw, setGw] = useState('70')
  const [weeks, setWeeks] = useState('12')
  const C = parseFloat(cw) || 0; const G = parseFloat(gw) || 0; const W = parseInt(weeks) || 1
  const total = (C - G) * 7700
  const daily = total / W / 7
  const at500 = total / 3500
  return <div className="card tool-card"><h3>⏳ {s.deficit.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.deficit.cw}</span><input type="number" value={cw} onChange={(e) => setCw(e.target.value)} /></label>
      <label className="field"><span>{s.deficit.gw}</span><input type="number" value={gw} onChange={(e) => setGw(e.target.value)} /></label>
      <label className="field"><span>{s.deficit.weeks}</span><input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} /></label>
    </div>
    <Res rows={[[s.deficit.total, money(total) + ' kcal'], [s.deficit.daily, money(daily) + ' kcal'], [s.deficit.at500, fmt(at500, 1) + ' weeks']]} />
  </div>
}

function BodyFat({ s }) {
  const [age, setAge] = useState('28')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('170')
  const a = parseFloat(age) || 0; const w = parseFloat(weight) || 0; const h = parseFloat(height) || 0
  const m = h / 100
  const bmi = m ? w / (m * m) : 0
  const bf = 1.2 * bmi + 0.23 * a - 10.8 * (gender === 'male' ? 1 : 0) - 5.4
  const cat = bf < 6 ? 'Essential' : bf < 14 ? 'Athletic' : bf < 18 ? 'Fitness' : bf < 25 ? 'Average' : bf < 32 ? 'Above avg' : 'Obese'
  return <div className="card tool-card"><h3>🧮 {s.bodyfat.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.bodyfat.age}</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} /></label>
      <label className="field"><span>{s.bodyfat.gender}</span>
        <select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">{s.bodyfat.male}</option><option value="female">{s.bodyfat.female}</option></select>
      </label>
      <label className="field"><span>{s.bodyfat.weight}</span><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
      <label className="field"><span>{s.bodyfat.height}</span><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></label>
    </div>
    <Res rows={[[s.bodyfat.bmi, fmt(bmi, 1)], [s.bodyfat.bf, fmt(bf, 1) + '%'], [s.bodyfat.cat, cat]]} />
  </div>
}

// ---------- Developer ----------

function BaseConv({ s }) {
  const [num, setNum] = useState('255')
  const [from, setFrom] = useState('10')
  const v = parseInt(num, parseInt(from))
  const show = (base) => (isNaN(v) ? '—' : v.toString(base).toUpperCase())
  return <div className="card tool-card"><h3>💽 {s.baseconv.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.baseconv.num}</span><input type="text" value={num} onChange={(e) => setNum(e.target.value)} /></label>
      <label className="field"><span>{s.baseconv.from}</span>
        <select value={from} onChange={(e) => setFrom(e.target.value)}><option value="2">2</option><option value="8">8</option><option value="10">10</option><option value="16">16</option></select>
      </label>
    </div>
    <Res rows={[[s.baseconv.bin, show(2)], [s.baseconv.oct, show(8)], [s.baseconv.dec, show(10)], [s.baseconv.hex, show(16)]]} />
  </div>
}

function HexRgb({ s }) {
  const [hex, setHex] = useState('#7c6cff')
  const [r, setR] = useState('124')
  const [g, setG] = useState('108')
  const [b, setB] = useState('255')
  const h = hex.replace('#', '')
  const rr = h.length === 6 ? parseInt(h.slice(0, 2), 16) : NaN
  const gg = h.length === 6 ? parseInt(h.slice(2, 4), 16) : NaN
  const bb = h.length === 6 ? parseInt(h.slice(4, 6), 16) : NaN
  const toHex = (n) => (isNaN(n) ? '' : '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, parseInt(x) || 0)).toString(16).padStart(2, '0')).join('').toUpperCase())
  return <div className="card tool-card"><h3>🎨 {s.hexrgb.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.hexrgb.hex}</span><input type="text" value={hex} onChange={(e) => setHex(e.target.value)} /></label>
      <div className="field" style={{ gridColumn: '1 / -1' }}>
        <div style={{ height: 46, borderRadius: 12, border: '1px solid var(--border)', background: h.length === 6 && !isNaN(rr) ? `rgb(${rr},${gg},${bb})` : 'var(--bg-soft)' }} />
      </div>
      <label className="field"><span>{s.hexrgb.r}</span><input type="number" value={r} onChange={(e) => setR(e.target.value)} /></label>
      <label className="field"><span>{s.hexrgb.g}</span><input type="number" value={g} onChange={(e) => setG(e.target.value)} /></label>
      <label className="field"><span>{s.hexrgb.b}</span><input type="number" value={b} onChange={(e) => setB(e.target.value)} /></label>
      <label className="field"><span>{s.hexrgb.out}</span><input type="text" value={toHex(0)} readOnly /></label>
    </div>
    <Res rows={[[s.hexrgb.out, h.length === 6 && !isNaN(rr) ? `rgb(${rr}, ${gg}, ${bb})` : '—']]} />
  </div>
}

function Ascii({ s }) {
  const [char, setChar] = useState('A')
  const [code, setCode] = useState('65')
  const c = char.charCodeAt(0)
  const ch = String.fromCharCode(parseInt(code) || 0)
  return <div className="card tool-card"><h3>🔣 {s.ascii.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.ascii.char}</span><input type="text" maxLength={1} value={char} onChange={(e) => setChar(e.target.value)} /></label>
      <label className="field"><span>{s.ascii.code}</span><input type="number" value={code} onChange={(e) => setCode(e.target.value)} /></label>
    </div>
    <Res rows={[[s.ascii.code, c], [s.ascii.char, ch]]} />
  </div>
}

function b64enc(text) {
  try { return btoa(unescape(encodeURIComponent(text))) } catch { return '' }
}
function b64dec(text) {
  try { return decodeURIComponent(escape(atob(text.trim()))) } catch { return '' }
}
function Base64({ s }) {
  const [text, setText] = useState('Hello Sahayak')
  const [out, setOut] = useState('')
  const enc = () => setOut(b64enc(text))
  const dec = () => setOut(b64dec(text))
  return <div className="card tool-card"><h3>🅱️ {s.base64.title}</h3>
    <div className="tool-grid">
      <label className="field" style={{ gridColumn: '1 / -1' }}><span>{s.base64.text}</span><input type="text" value={text} onChange={(e) => setText(e.target.value)} /></label>
      <button className="btn btn-primary" onClick={enc}>{s.base64.enc}</button>
      <button className="btn btn-ghost" onClick={dec}>{s.base64.dec}</button>
    </div>
    <div className="tool-result"><div className="row"><span>{s.base64.out}</span><b style={{ fontSize: 13, wordBreak: 'break-all' }}>{out || '—'}</b></div></div>
  </div>
}

function UrlCode({ s }) {
  const [text, setText] = useState('hello world & more')
  const [out, setOut] = useState('')
  const enc = () => setOut(encodeURIComponent(text))
  const dec = () => { try { setOut(decodeURIComponent(text)) } catch { setOut('—') } }
  return <div className="card tool-card"><h3>🔗 {s.urlcode.title}</h3>
    <div className="tool-grid">
      <label className="field" style={{ gridColumn: '1 / -1' }}><span>{s.urlcode.text}</span><input type="text" value={text} onChange={(e) => setText(e.target.value)} /></label>
      <button className="btn btn-primary" onClick={enc}>{s.urlcode.enc}</button>
      <button className="btn btn-ghost" onClick={dec}>{s.urlcode.dec}</button>
    </div>
    <div className="tool-result"><div className="row"><span>{s.urlcode.out}</span><b style={{ fontSize: 13, wordBreak: 'break-all' }}>{out || '—'}</b></div></div>
  </div>
}

function JsonFmt({ s }) {
  const [txt, setTxt] = useState('{"name":"Sahayak","free":true}')
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const fmt = () => {
    try { setOut(JSON.stringify(JSON.parse(txt), null, 2)); setErr('') } catch { setErr(s.jsonfmt.err) }
  }
  return <div className="card tool-card"><h3>📄 {s.jsonfmt.title}</h3>
    <textarea rows={4} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={s.jsonfmt.paste} />
    <button className="btn btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={fmt}>{s.jsonfmt.fmt}</button>
    {err && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>{err}</p>}
    {out && <pre style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 12, overflowX: 'auto', marginTop: 10, maxHeight: 260, overflowY: 'auto' }}>{out}</pre>}
  </div>
}

const ipToInt = (ip) => {
  const p = ip.split('.').map(Number)
  if (p.length !== 4 || p.some((x) => isNaN(x) || x < 0 || x > 255)) return null
  return p.reduce((a, b) => ((a << 8) | b) >>> 0, 0)
}
const intToIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.')
function Subnet({ s }) {
  const [ip, setIp] = useState('192.168.1.0')
  const [prefix, setPrefix] = useState('24')
  const ipInt = ipToInt(ip)
  const p = parseInt(prefix) || 0
  let net = '—'; let mask = '—'; let bc = '—'; let hosts = '—'; let range = '—'
  if (ipInt !== null && p >= 0 && p <= 32) {
    const maskInt = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0
    const netInt = ipInt & maskInt
    const bcInt = netInt | (~maskInt >>> 0)
    mask = intToIp(maskInt)
    net = intToIp(netInt)
    bc = intToIp(bcInt)
    hosts = p >= 31 ? 0 : Math.pow(2, 32 - p) - 2
    range = hosts ? `${intToIp(netInt + 1)} – ${intToIp(bcInt - 1)}` : '—'
  }
  return <div className="card tool-card"><h3>🕸️ {s.subnet.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.subnet.ip}</span><input type="text" value={ip} onChange={(e) => setIp(e.target.value)} /></label>
      <label className="field"><span>{s.subnet.prefix}</span><input type="number" min="0" max="32" value={prefix} onChange={(e) => setPrefix(e.target.value)} /></label>
    </div>
    <Res rows={[[s.subnet.net, net], [s.subnet.mask, mask], [s.subnet.bc, bc], [s.subnet.hosts, hosts], [s.subnet.range, range]]} />
  </div>
}

const ST_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
function Storage({ s }) {
  const [val, setVal] = useState('1')
  const [unit, setUnit] = useState('GB')
  const bytes = (parseFloat(val) || 0) * Math.pow(1024, ST_UNITS.indexOf(unit))
  return <div className="card tool-card"><h3>💾 {s.storage.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.storage.value}</span><input type="number" value={val} onChange={(e) => setVal(e.target.value)} /></label>
      <label className="field"><span>{s.storage.unit}</span>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>{ST_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}</select>
      </label>
    </div>
    <Res rows={ST_UNITS.map((u) => [u, fmt(bytes / Math.pow(1024, ST_UNITS.indexOf(u)), 3)])} />
  </div>
}

// ---------- Farmer ----------

function Seed({ s }) {
  const [area, setArea] = useState('1')
  const [rate, setRate] = useState('20')
  const [germ, setGerm] = useState('85')
  const A = parseFloat(area) || 0; const R = parseFloat(rate) || 0; const G = parseFloat(germ) || 100
  const need = A * R
  const adj = need * 100 / G
  return <div className="card tool-card"><h3>🌱 {s.seed.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.seed.area}</span><input type="number" value={area} onChange={(e) => setArea(e.target.value)} /></label>
      <label className="field"><span>{s.seed.rate}</span><input type="number" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
      <label className="field"><span>{s.seed.germ}</span><input type="number" value={germ} onChange={(e) => setGerm(e.target.value)} /></label>
    </div>
    <Res rows={[[s.seed.need, fmt(need, 2) + ' kg'], [s.seed.adj, fmt(adj, 2) + ' kg']]} />
  </div>
}

function Fertilizer({ s }) {
  const [area, setArea] = useState('1')
  const [target, setTarget] = useState('30')
  const [grade, setGrade] = useState('46')
  const A = parseFloat(area) || 0; const T = parseFloat(target) || 0; const G = parseFloat(grade) || 0
  const need = G ? A * T * 100 / G : 0
  return <div className="card tool-card"><h3>🌾 {s.fertilizer.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.fertilizer.area}</span><input type="number" value={area} onChange={(e) => setArea(e.target.value)} /></label>
      <label className="field"><span>{s.fertilizer.target}</span><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
      <label className="field"><span>{s.fertilizer.grade}</span><input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} /></label>
    </div>
    <Res rows={[[s.fertilizer.need, fmt(need, 2) + ' kg'], [s.fertilizer.bags, Math.ceil(need / 50)]]} />
  </div>
}

function Pesticide({ s }) {
  const [tank, setTank] = useState('15')
  const [dose, setDose] = useState('2')
  const T = parseFloat(tank) || 0; const D = parseFloat(dose) || 0
  return <div className="card tool-card"><h3>🧪 {s.pesticide.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.pesticide.tank}</span><input type="number" value={tank} onChange={(e) => setTank(e.target.value)} /></label>
      <label className="field"><span>{s.pesticide.dose}</span><input type="number" value={dose} onChange={(e) => setDose(e.target.value)} /></label>
    </div>
    <Res rows={[[s.pesticide.need, fmt(T * D, 1) + ' ml']]} />
  </div>
}

function Yield({ s }) {
  const [area, setArea] = useState('2')
  const [per, setPer] = useState('800')
  const [price, setPrice] = useState('20')
  const A = parseFloat(area) || 0; const P = parseFloat(per) || 0; const Pr = parseFloat(price) || 0
  const total = A * P
  return <div className="card tool-card"><h3>🚜 {s.yield.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.yield.area}</span><input type="number" value={area} onChange={(e) => setArea(e.target.value)} /></label>
      <label className="field"><span>{s.yield.per}</span><input type="number" value={per} onChange={(e) => setPer(e.target.value)} /></label>
      <label className="field"><span>{s.yield.price}</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
    </div>
    <Res rows={[[s.yield.total, money(total) + ' kg'], [s.yield.value, '₹ ' + money(total * Pr)]]} />
  </div>
}

// ---------- Music ----------

function Metronome({ s }) {
  const [bpm, setBpm] = useState(120)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(0)
  const ref = useRef(null)
  const ctxRef = useRef(null)
  const tick = () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    const ctx = ctxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    gain.gain.value = 0.15
    osc.connect(gain); gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.stop(ctx.currentTime + 0.09)
    setBeat((b) => b + 1)
  }
  const start = () => {
    setRunning(true); setBeat(0)
    tick()
    ref.current = setInterval(tick, 60000 / bpm)
  }
  const stop = () => { setRunning(false); if (ref.current) clearInterval(ref.current) }
  return <div className="card tool-card"><h3>🥁 {s.metronome.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.metronome.bpm}</span>
        <div className="unit-row"><input type="number" min="40" max="240" value={bpm} onChange={(e) => setBpm(+e.target.value)} />
          <input type="range" min="40" max="240" value={bpm} onChange={(e) => setBpm(+e.target.value)} style={{ width: 130 }} />
        </div>
      </label>
    </div>
    <div className="tool-actions">
      <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={running ? stop : start}>{running ? '⏸ ' + s.metronome.stop : '▶ ' + s.metronome.start}</button>
    </div>
    <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 10 }}>{s.metronome.beat}: <b style={{ color: 'var(--accent)' }}>{beat}</b></p>
  </div>
}

function BpmMs({ s }) {
  const [bpm, setBpm] = useState('120')
  const [ms, setMs] = useState('500')
  const b = parseFloat(bpm) || 0
  const beatMs = b ? 60000 / b : 0
  const ratios = { [s.bpmms.whole]: 4, [s.bpmms.half]: 2, [s.bpmms.quarter]: 1, [s.bpmms.eighth]: 0.5, [s.bpmms.sixteenth]: 0.25 }
  const revBpm = parseFloat(ms) ? 60000 / parseFloat(ms) : 0
  return <div className="card tool-card"><h3>🎵 {s.bpmms.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.bpmms.bpm}</span><input type="number" value={bpm} onChange={(e) => setBpm(e.target.value)} /></label>
      <label className="field"><span>{s.bpmms.ms}</span><input type="number" value={ms} onChange={(e) => setMs(e.target.value)} /></label>
    </div>
    <Res rows={Object.keys(ratios).map((k) => [k, Math.round(beatMs * ratios[k]) + ' ms'])} />
    <Res rows={[[s.bpmms.bpm + ' ⇐ ' + s.bpmms.ms, revBpm ? fmt(revBpm, 1) + ' BPM' : '—']]} />
  </div>
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
function midiOf(note) {
  const m = note.match(/^([A-G]#?)(-?\d)$/)
  if (!m) return null
  return 12 * (parseInt(m[2]) + 1) + NOTE_NAMES.indexOf(m[1])
}
function noteOf(midi) {
  return NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1)
}
function freqOf(midi) { return 440 * Math.pow(2, (midi - 69) / 12) }
function Notefreq({ s }) {
  const all = []
  for (let o = 0; o <= 8; o++) for (const n of NOTE_NAMES) all.push(n + o)
  const [note, setNote] = useState('A4')
  const [freq, setFreq] = useState('440')
  const midi = midiOf(note)
  const nearest = (() => {
    const f = parseFloat(freq)
    if (isNaN(f) || f <= 0) return '—'
    let best = 0; let diff = 1e9
    for (let m = 0; m <= 108; m++) { const d = Math.abs(freqOf(m) - f); if (d < diff) { diff = d; best = m } }
    return noteOf(best)
  })()
  return <div className="card tool-card"><h3>🎼 {s.notefreq.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.notefreq.note}</span>
        <select value={note} onChange={(e) => setNote(e.target.value)}>{all.map((n) => <option key={n} value={n}>{n}</option>)}</select>
      </label>
      <label className="field"><span>{s.notefreq.freq}</span><input type="number" value={freq} onChange={(e) => setFreq(e.target.value)} /></label>
    </div>
    <Res rows={[[s.notefreq.freq, midi !== null ? fmt(freqOf(midi), 2) + ' Hz' : '—'], [s.notefreq.or + ' ' + s.notefreq.fromFreq, nearest]]} />
  </div>
}

const INTERVALS = ['Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave']
function Interval({ s }) {
  const all = []
  for (let o = 2; o <= 6; o++) for (const n of NOTE_NAMES) all.push(n + o)
  const [n1, setN1] = useState('C4')
  const [n2, setN2] = useState('G4')
  const m1 = midiOf(n1); const m2 = midiOf(n2)
  const semis = m1 !== null && m2 !== null ? ((m2 - m1) % 12 + 12) % 12 : null
  return <div className="card tool-card"><h3>🎶 {s.interval.title}</h3>
    <div className="tool-grid">
      <label className="field"><span>{s.interval.n1}</span>
        <select value={n1} onChange={(e) => setN1(e.target.value)}>{all.map((n) => <option key={n} value={n}>{n}</option>)}</select>
      </label>
      <label className="field"><span>{s.interval.n2}</span>
        <select value={n2} onChange={(e) => setN2(e.target.value)}>{all.map((n) => <option key={n} value={n}>{n}</option>)}</select>
      </label>
    </div>
    <Res rows={[[s.interval.semis, semis === null ? '—' : semis], [s.interval.name, semis === null ? '—' : INTERVALS[semis]]]} />
  </div>
}

export const P3_RENDER = {
  profit: Profit, markup: Markup, breakeven: Breakeven, roi: ROI, change: Change, unitprice: UnitPrice, commission: Commission, billsplit: BillSplit,
  macros: Macros, onerm: OneRM, pace: Pace, steps: Steps, deficit: Deficit, bodyfat: BodyFat,
  baseconv: BaseConv, hexrgb: HexRgb, ascii: Ascii, base64: Base64, urlcode: UrlCode, jsonfmt: JsonFmt, subnet: Subnet, storage: Storage,
  seed: Seed, fertilizer: Fertilizer, pesticide: Pesticide, yield: Yield,
  metronome: Metronome, bpmms: BpmMs, notefreq: Notefreq, interval: Interval,
}
