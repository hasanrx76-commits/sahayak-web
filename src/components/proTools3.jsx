import { useRef, useState } from 'react'

const fmt = (n, d = 4) => (isNaN(n) || !isFinite(n) ? '' : +Number(n).toFixed(d))
const money = (n) => (isNaN(n) ? '0' : Math.round(n).toLocaleString('en-IN'))
const Res = ({ rows }) => (
  <div className="tool-result">{rows.map((r, i) => <div key={i} className="row"><span>{r[0]}</span><b>{r[1]}</b></div>)}</div>
)

export const P3_CATEGORIES = [
  { id: 'business', icon: '🏪', tools: ['profit', 'markup', 'breakeven', 'roi', 'change', 'unitprice', 'commission', 'billsplit'] },
  { id: 'fitness', icon: '🏃', tools: ['macros', 'onerm', 'pace', 'steps', 'deficit', 'bodyfat'] },
  { id: 'developer', icon: '💻', tools: ['baseconv', 'hexrgb', 'ascii', 'base64', 'urlcode', 'jsonfmt', 'subnet', 'storage', 'website'] },
  { id: 'farmer', icon: '🧑‍🌾', tools: ['seed', 'fertilizer', 'pesticide', 'yield'] },
  { id: 'music', icon: '🎵', tools: ['metronome', 'bpmms', 'notefreq', 'interval'] },
]

export const P3_TAB = {
  profit: '💰', markup: '🏷️', breakeven: '⚖️', roi: '🎯', change: '💵', unitprice: '🔎', commission: '🤝', billsplit: '💳',
  macros: '🥗', onerm: '🏋️', pace: '🏃', steps: '👟', deficit: '⏳', bodyfat: '🧮',
  baseconv: '💽', hexrgb: '🎨', ascii: '🔣', base64: '🅱️', urlcode: '🔗', jsonfmt: '📄', subnet: '🕸️', storage: '💾', website: '🌐',
  seed: '🌱', fertilizer: '🌾', pesticide: '🧪', yield: '🚜',
  metronome: '🥁', bpmms: '🎵', notefreq: '🎼', interval: '🎶',
}

export const P3_STRINGS = {
  en: {
    cats: { business: 'Business', fitness: 'Fitness', developer: 'Developer', farmer: 'Farmer', music: 'Music' },
    tabs: {
      profit: 'Profit', markup: 'Markup', breakeven: 'Break-even', roi: 'ROI', change: 'Change', unitprice: 'Unit Price', commission: 'Commission', billsplit: 'Bill Split',
      macros: 'Macros', onerm: '1RM', pace: 'Pace', steps: 'Steps', deficit: 'Deficit', bodyfat: 'Body Fat',
      baseconv: 'Base Conv', hexrgb: 'HEX/RGB', ascii: 'ASCII', base64: 'Base64', urlcode: 'URL', jsonfmt: 'JSON', subnet: 'Subnet', storage: 'Storage', website: 'Website Builder',
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
    website: { title: 'Website Builder', prompt: 'Describe the website you want', placeholder: 'e.g. "A modern portfolio site for a photographer with dark mode", dark mode toggle, and contact form', generate: 'Generate Website', generating: 'Building…', download: 'Download HTML', clear: 'Clear', preview: 'Live Preview', desc: 'Describe what you want and get a complete HTML file instantly.' },
  },
  hi: {
    cats: { business: 'व्यापार', fitness: 'फिटनेस', developer: 'डेवलपर', farmer: 'किसान', music: 'संगीत' },
    tabs: {
      profit: 'लाभ', markup: 'मार्कअप', breakeven: 'ब्रेक-ईवन', roi: 'ROI', change: 'छुट्टा', unitprice: 'यूनिट मूल्य', commission: 'कमीशन', billsplit: 'बिल बांटें',
      macros: 'मैक्रोज़', onerm: '1RM', pace: 'गति', steps: 'कदम', deficit: 'कटौती', bodyfat: 'शरीर में चर्बी',
      baseconv: 'बेस कन्वर्ट', hexrgb: 'HEX/RGB', ascii: 'ASCII', base64: 'Base64', urlcode: 'URL', jsonfmt: 'JSON', subnet: 'सबनेट', storage: 'स्टोरेज', website: 'वेबसाइट बिल्डर',
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
    website: { title: 'वेबसाइट बिल्डर', prompt: 'मनचाही वेबसाइट का वर्णन करें', placeholder: 'उदाहरण: फोटोग्राफर के लिए डार्क मोड वाला पोर्टफोलियो', generate: 'वेबसाइट बनाएं', generating: 'निर्माण हो रहा…', download: 'HTML डाउनलोड', clear: 'साफ़ करें', preview: 'लाइव प्रीव्यू', desc: 'विवरण दें और तुरंत पूरी HTML फाइल पाएं।' },
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

function WebsiteBuilder({ s }) {
  const [prompt, setPrompt] = useState('')
  const [html, setHtml] = useState('')
  const [generating, setGenerating] = useState(false)
  const iframeRef = useRef(null)

  const templates = {
    portfolio: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} - Portfolio</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#0f0f0f;color:#e0e0e0}nav{position:fixed;top:0;width:100%;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;background:rgba(15,15,15,0.95);backdrop-filter:blur(10px);z-index:100;border-bottom:1px solid rgba(255,255,255,0.05)}nav .logo{font-size:24px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:30px}nav a{color:#aaa;text-decoration:none;transition:color 0.3s}nav a:hover{color:${color}}.hero{height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 40px;background:linear-gradient(135deg,#0f0f0f 0%,${color}22 50%,#0f0f0f 100%)}.hero h1{font-size:clamp(36px,6vw,72px);font-weight:800;line-height:1.1;margin-bottom:20px}.hero h1 span{color:${color}}.hero p{font-size:20px;color:#888;max-width:600px;margin-bottom:30px}.hero .btn{display:inline-block;padding:14px 32px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600;transition:transform 0.2s,box-shadow 0.2s}.hero .btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px ${color}66}section{padding:80px 40px}.section-title{font-size:36px;margin-bottom:10px;color:${color}}.section-sub{color:#888;margin-bottom:40px;font-size:16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}.project{background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);transition:transform 0.3s,box-shadow 0.3s}.project:hover{transform:translateY(-5px);box-shadow:0 12px 40px rgba(0,0,0,0.5)}.project-img{height:200px;background:linear-gradient(135deg,${color}33,#222);display:flex;align-items:center;justify-content:center;font-size:48px}.project-info{padding:20px}.project-info h3{margin-bottom:8px}.project-info p{color:#888;font-size:14px;line-height:1.5}footer{text-align:center;padding:40px;color:#555;border-top:1px solid rgba(255,255,255,0.05)}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#home">Home</a></li><li><a href="#work">Work</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></nav><section class="hero" id="home"><h1>Hi, I'm <span>${name}</span><br>I build things for the web.</h1><p>A creative developer passionate about building beautiful digital experiences.</p><a href="#work" class="btn">View My Work</a></section><section id="work"><h2 class="section-title">Featured Work</h2><p class="section-sub">A selection of recent projects.</p><div class="grid"><div class="project"><div class="project-img">🚀</div><div class="project-info"><h3>Project Alpha</h3><p>A modern web application built with cutting-edge technologies.</p></div></div><div class="project"><div class="project-img">🎨</div><div class="project-info"><h3>Design System</h3><p>A comprehensive design system for consistent brand experiences.</p></div></div><div class="project"><div class="project-img">📱</div><div class="project-info"><h3>Mobile App</h3><p>Cross-platform mobile application with seamless user experience.</p></div></div></div></section><section id="about"><h2 class="section-title">About Me</h2><p class="section-sub" style="max-width:600px">I'm a full-stack developer with 5+ years of experience creating digital products. I love turning complex problems into simple, elegant solutions.</p></section><section id="contact"><h2 class="section-title">Get In Touch</h2><p class="section-sub">Have a project in mind? Let's talk.</p><p style="color:#888">hello@${name.toLowerCase().replace(/\\s+/g,'')}.com</p></section><footer>© 2025 ${name}. All rights reserved.</footer></body></html>`,

    landing: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;color:#333}nav{display:flex;justify-content:space-between;align-items:center;padding:20px 40px;background:#fff;position:sticky;top:0;z-index:10;box-shadow:0 1px 10px rgba(0,0,0,0.05)}nav .logo{font-size:24px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:24px}nav a{color:#666;text-decoration:none}nav a:hover{color:${color}}.hero{padding:100px 40px;text-align:center;background:linear-gradient(180deg,#f8f9ff 0%,#fff 100%)}.hero h1{font-size:clamp(32px,5vw,56px);font-weight:800;margin-bottom:20px;line-height:1.2}.hero h1 span{color:${color}}.hero p{font-size:18px;color:#666;max-width:600px;margin:0 auto 30px}.hero .btn{display:inline-block;padding:16px 40px;background:${color};color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;transition:all 0.3s;box-shadow:0 4px 15px ${color}44}.hero .btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px ${color}66}.features{padding:80px 40px;background:#f8f9ff}.features h2{text-align:center;font-size:36px;margin-bottom:10px}.features .sub{text-align:center;color:#888;margin-bottom:50px}.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:30px;max-width:1100px;margin:0 auto}.feat{background:#fff;padding:30px;border-radius:16px;box-shadow:0 2px 20px rgba(0,0,0,0.04);transition:transform 0.3s}.feat:hover{transform:translateY(-4px)}.feat .icon{font-size:40px;margin-bottom:16px}.feat h3{margin-bottom:10px;font-size:20px}.feat p{color:#666;line-height:1.6}.testimonials{padding:80px 40px;text-align:center}.testimonials h2{font-size:36px;margin-bottom:40px}.quotes{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}.quote{background:#f8f9ff;padding:24px;border-radius:12px;max-width:350px;text-align:left}.quote p{font-style:italic;color:#555;line-height:1.6;margin-bottom:12px}.quote .author{font-weight:600;color:${color}}.cta{padding:80px 40px;text-align:center;background:${color};color:#fff}.cta h2{font-size:36px;margin-bottom:10px}.cta p{margin-bottom:30px;opacity:0.9}.cta .btn{display:inline-block;padding:16px 40px;background:#fff;color:${color};border-radius:10px;text-decoration:none;font-weight:600;font-size:16px}footer{text-align:center;padding:30px;color:#888}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#features">Features</a></li><li><a href="#testimonials">Reviews</a></li><li><a href="#pricing">Pricing</a></li></ul><a href="#cta" class="btn" style="padding:10px 24px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Get Started</a></nav><section class="hero"><h1>Build Something <span>Amazing</span> Today</h1><p>The all-in-one platform that helps you ship faster, smarter, and better.</p><a href="#cta" class="btn">Start Free Trial</a></section><section class="features" id="features"><h2>Why Choose ${name}?</h2><p class="sub">Everything you need in one place</p><div class="feat-grid"><div class="feat"><div class="icon">⚡</div><h3>Lightning Fast</h3><p>Optimized performance that keeps your users happy and engaged.</p></div><div class="feat"><div class="icon">🔒</div><h3>Secure by Default</h3><p>Enterprise-grade security to protect your data and privacy.</p></div><div class="feat"><div class="icon">🎯</div><h3>Easy to Use</h3><p>Intuitive interface that anyone can master in minutes.</p></div></div></section><section class="testimonials" id="testimonials"><h2>Loved by Thousands</h2><div class="quotes"><div class="quote"><p>"This tool changed how our team works. Highly recommended!"</p><div class="author">— Sarah K.</div></div><div class="quote"><p>"Best investment we've made this year. The ROI is incredible."</p><div class="author">— Mike R.</div></div></div></section><section class="cta" id="cta"><h2>Ready to Get Started?</h2><p>Join 10,000+ happy users today.</p><a href="#" class="btn">Start Free Trial →</a></section><footer>© 2025 ${name}. All rights reserved.</footer></body></html>`,

    restaurant: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} - Restaurant</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Georgia',serif;background:#1a1210;color:#f5e6d3}nav{position:fixed;top:0;width:100%;padding:20px 40px;display:flex;justify-content:space-between;align-items:center;background:rgba(26,18,16,0.95);z-index:100}nav .logo{font-size:28px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:30px}nav a{color:#c4a882;text-decoration:none;letter-spacing:1px;text-transform:uppercase;font-size:13px}nav a:hover{color:${color}}.hero{height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0 40px;background:linear-gradient(135deg,#1a1210 0%,${color}22 50%,#1a1210 100%)}.hero h1{font-size:clamp(40px,7vw,80px);font-weight:400;line-height:1.1;margin-bottom:20px;font-style:italic}.hero p{font-size:18px;color:#c4a882;max-width:500px;margin-bottom:30px;letter-spacing:2px}.hero .btn{display:inline-block;padding:16px 40px;border:2px solid ${color};color:${color};text-decoration:none;font-size:14px;letter-spacing:3px;text-transform:uppercase;transition:all 0.3s}.hero .btn:hover{background:${color};color:#1a1210}section{padding:80px 40px}.section-title{font-size:36px;text-align:center;margin-bottom:10px;color:${color};font-style:italic}.section-sub{text-align:center;color:#c4a882;margin-bottom:40px;font-size:14px;letter-spacing:2px;text-transform:uppercase}.menu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1000px;margin:0 auto}.menu-item{background:#2a1f1a;border-radius:12px;padding:24px;border:1px solid ${color}22}.menu-item h3{color:${color};margin-bottom:8px;font-size:20px}.menu-item p{color:#c4a882;font-size:14px;line-height:1.6}.menu-item .price{display:inline-block;margin-top:12px;color:${color};font-size:18px;font-weight:700}.hours{text-align:center;padding:60px 40px;background:#2a1f1a;margin:0 40px;border-radius:16px}.hours h2{color:${color};font-size:28px;margin-bottom:20px;font-style:italic}.hours p{color:#c4a882;line-height:2;font-size:16px}footer{text-align:center;padding:40px;color:#555;border-top:1px solid #2a1f1a}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#menu">Menu</a></li><li><a href="#hours">Hours</a></li><li><a href="#contact">Reserve</a></li></ul></nav><section class="hero"><h1>Experience<br>Fine Dining</h1><p>Crafting unforgettable moments through culinary excellence since 1985.</p><a href="#menu" class="btn">View Menu</a></section><section id="menu"><h2 class="section-title">Our Menu</h2><p class="section-sub">Signature Dishes</p><div class="menu-grid"><div class="menu-item"><h3>Truffle Risotto</h3><p>Arborio rice, black truffle, parmesan, white wine reduction.</p><span class="price">$32</span></div><div class="menu-item"><h3>Grilled Salmon</h3><p>Atlantic salmon, lemon butter, seasonal vegetables.</p><span class="price">$28</span></div><div class="menu-item"><h3>Filet Mignon</h3><p>Prime beef tenderling, red wine jus, truffle mash.</p><span class="price">$45</span></div><div class="menu-item"><h3>Chocolate Soufflé</h3><p>Dark Belgian chocolate, vanilla crème anglaise.</p><span class="price">$16</span></div></div></section><div class="hours" id="hours"><h2>Opening Hours</h2><p>Monday - Thursday: 5:00 PM - 10:00 PM<br>Friday - Saturday: 5:00 PM - 11:00 PM<br>Sunday: 4:00 PM - 9:00 PM</p></div><footer id="contact">© 2025 ${name}. Reservations: (555) 123-4567</footer></body></html>`,

    blog: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} - Blog</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fafafa;color:#333}nav{display:flex;justify-content:space-between;align-items:center;padding:20px 40px;background:#fff;box-shadow:0 1px 10px rgba(0,0,0,0.04)}nav .logo{font-size:24px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:24px}nav a{color:#666;text-decoration:none}nav a:hover{color:${color}}.hero{padding:60px 40px;text-align:center;background:${color};color:#fff}.hero h1{font-size:clamp(28px,4vw,48px);font-weight:800;margin-bottom:10px}.hero p{opacity:0.9;font-size:18px}main{max-width:800px;margin:0 auto;padding:40px}.post{background:#fff;border-radius:12px;padding:30px;margin-bottom:24px;box-shadow:0 1px 10px rgba(0,0,0,0.04)}.post .tag{display:inline-block;padding:4px 12px;background:${color}15;color:${color};border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px}.post h2{margin-bottom:8px;font-size:24px}.post .meta{color:#999;font-size:13px;margin-bottom:16px}.post p{color:#666;line-height:1.7}.post .read-more{display:inline-block;margin-top:16px;color:${color};text-decoration:none;font-weight:600}footer{text-align:center;padding:30px;color:#999}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#">Home</a></li><li><a href="#">Articles</a></li><li><a href="#">About</a></li></ul></nav><div class="hero"><h1>${name}</h1><p>Thoughts, stories, and ideas.</p></div><main><div class="post"><span class="tag">Technology</span><h2>The Future of Web Development</h2><div class="meta">Jan 15, 2025 · 5 min read</div><p>Web development is evolving at an unprecedented pace. From AI-powered tools to edge computing, the landscape is shifting dramatically...</p><a href="#" class="read-more">Read More →</a></div><div class="post"><span class="tag">Design</span><h2>Why Good Design Matters</h2><div class="meta">Jan 10, 2025 · 4 min read</div><p>Design is not just about aesthetics. It's about solving problems and creating experiences that resonate with people...</p><a href="#" class="read-more">Read More →</a></div><div class="post"><span class="tag">Productivity</span><h2>10 Tips for Remote Work</h2><div class="meta">Jan 5, 2025 · 3 min read</div><p>Working from home can be challenging. Here are proven strategies to stay focused and productive...</p><a href="#" class="read-more">Read More →</a></div></main><footer>© 2025 ${name}</footer></body></html>`,

    business: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;color:#333}nav{display:flex;justify-content:space-between;align-items:center;padding:20px 60px;background:#fff;box-shadow:0 1px 10px rgba(0,0,0,0.04)}nav .logo{font-size:22px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:28px}nav a{color:#666;text-decoration:none;font-size:14px}nav a:hover{color:${color}}.hero{display:flex;align-items:center;min-height:80vh;padding:0 60px;background:linear-gradient(135deg,#f0f4ff 0%,#fff 100%)}.hero-content{max-width:500px}.hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;line-height:1.15;margin-bottom:20px}.hero h1 span{color:${color}}.hero p{font-size:18px;color:#666;margin-bottom:30px;line-height:1.6}.hero .btn{display:inline-block;padding:14px 32px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600;transition:all 0.2s}.hero .btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px ${color}44}.hero .visual{flex:1;display:flex;justify-content:center;font-size:200px;opacity:0.15}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;padding:60px;background:#f8f9ff;text-align:center}.stat h3{font-size:36px;color:${color};font-weight:800}.stat p{color:#888;margin-top:8px;font-size:14px}.services{padding:80px 60px}.services h2{font-size:36px;margin-bottom:40px;text-align:center}.svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px}.svc{padding:30px;background:#f8f9ff;border-radius:12px;transition:transform 0.3s}.svc:hover{transform:translateY(-3px)}.svc h3{margin-bottom:10px}.svc p{color:#666;line-height:1.6;font-size:14px}.cta{padding:80px 60px;text-align:center;background:${color};color:#fff}.cta h2{font-size:36px;margin-bottom:10px}.cta p{margin-bottom:30px;opacity:0.9}.cta .btn{display:inline-block;padding:14px 32px;background:#fff;color:${color};border-radius:8px;text-decoration:none;font-weight:600}footer{text-align:center;padding:30px;color:#888}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#services">Services</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul><a href="#contact" class="btn" style="padding:10px 24px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Get a Quote</a></nav><section class="hero"><div class="hero-content"><h1>We Help <span>${name}</span> Grow</h1><p>Delivering innovative solutions that drive real business results. Your success is our mission.</p><a href="#contact" class="btn">Start a Project</a></div><div class="visual">🚀</div></section><div class="stats"><div class="stat"><h3>500+</h3><p>Projects Delivered</p></div><div class="stat"><h3>98%</h3><p>Client Satisfaction</p></div><div class="stat"><h3>50+</h3><p>Team Members</p></div><div class="stat"><h3>10+</h3><p>Years Experience</p></div></div><section class="services" id="services"><h2>Our Services</h2><div class="svc-grid"><div class="svc"><h3>🎨 Web Design</h3><p>Beautiful, responsive websites that capture your brand identity.</p></div><div class="svc"><h3>💻 Development</h3><p>Robust web applications built with modern technologies.</p></div><div class="svc"><h3>📱 Mobile Apps</h3><p>Native and cross-platform mobile applications.</p></div><div class="svc"><h3>📈 SEO & Marketing</h3><p>Data-driven strategies to grow your online presence.</p></div></div></section><section class="cta" id="contact"><h2>Let's Build Something Great</h2><p>Ready to take your business to the next level?</p><a href="mailto:hello@${name.toLowerCase().replace(/\\s+/g,'')}.com" class="btn">Contact Us →</a></section><footer>© 2025 ${name}. All rights reserved.</footer></body></html>`,

    ecommerce: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} - Shop</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;color:#333}nav{display:flex;justify-content:space-between;align-items:center;padding:16px 40px;background:#fff;box-shadow:0 1px 8px rgba(0,0,0,0.06);position:sticky;top:0;z-index:100}nav .logo{font-size:22px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:24px}nav a{color:#666;text-decoration:none;font-size:14px}nav .cart{font-size:20px;cursor:pointer}.hero{padding:60px 40px;text-align:center;background:linear-gradient(135deg,${color}11,#fff)}.hero h1{font-size:clamp(28px,4vw,48px);font-weight:800;margin-bottom:10px}.hero h1 span{color:${color}}.hero p{color:#888;font-size:16px;margin-bottom:24px}.hero .btn{display:inline-block;padding:12px 28px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600}.products{padding:60px 40px}.products h2{text-align:center;font-size:32px;margin-bottom:40px}.prod-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;max-width:1100px;margin:0 auto}.prod{background:#fafafa;border-radius:12px;overflow:hidden;transition:transform 0.3s;border:1px solid #f0f0f0}.prod:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,0.08)}.prod-img{height:220px;background:linear-gradient(135deg,${color}22,#f0f0f0);display:flex;align-items:center;justify-content:center;font-size:56px}.prod-info{padding:20px}.prod-info .cat{color:${color};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.prod-info h3{margin-bottom:8px}.prod-info .price{font-size:20px;font-weight:700;color:${color}}.prod-info .btn{display:block;margin-top:12px;padding:10px;background:${color};color:#fff;text-align:center;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;transition:opacity 0.2s}.prod-info .btn:hover{opacity:0.9}footer{text-align:center;padding:30px;color:#888;border-top:1px solid #f0f0f0}</style></head><body><nav><div class="logo">${name}</div><ul><li><a href="#">Home</a></li><li><a href="#products">Shop</a></li><li><a href="#">About</a></li></ul><span class="cart">🛒</span></nav><section class="hero"><h1>Discover <span>${name}</span></h1><p>Curated products for modern living.</p><a href="#products" class="btn">Shop Now</a></section><section class="products" id="products"><h2>Featured Products</h2><div class="prod-grid"><div class="prod"><div class="prod-img">👟</div><div class="prod-info"><div class="cat">Footwear</div><h3>Classic Sneakers</h3><span class="price">$89</span><a href="#" class="btn">Add to Cart</a></div></div><div class="prod"><div class="prod-img">🎒</div><div class="prod-info"><div class="cat">Bags</div><h3>Travel Backpack</h3><span class="price">$129</span><a href="#" class="btn">Add to Cart</a></div></div><div class="prod"><div class="prod-img">⌚</div><div class="prod-info"><div class="cat">Accessories</div><h3>Smart Watch</h3><span class="price">$199</span><a href="#" class="btn">Add to Cart</a></div></div><div class="prod"><div class="prod-img">🕶️</div><div class="prod-info"><div class="cat">Eyewear</div><h3>Premium Sunglasses</h3><span class="price">$65</span><a href="#" class="btn">Add to Cart</a></div></div></div></section><footer>© 2025 ${name}. All rights reserved.</footer></body></html>`,

    school: (name, color) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:#f5f7fa;color:#333}nav{display:flex;justify-content:space-between;align-items:center;padding:16px 40px;background:#fff;box-shadow:0 1px 8px rgba(0,0,0,0.05)}nav .logo{font-size:22px;font-weight:700;color:${color}}nav ul{list-style:none;display:flex;gap:24px}nav a{color:#666;text-decoration:none}nav .btn{padding:10px 20px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px}.hero{padding:80px 40px;text-align:center;background:linear-gradient(135deg,${color}08,${color}15)}.hero h1{font-size:clamp(32px,5vw,52px);font-weight:800;margin-bottom:16px}.hero h1 span{color:${color}}.hero p{font-size:18px;color:#666;max-width:600px;margin:0 auto 30px}.hero .btn{display:inline-block;padding:14px 32px;background:${color};color:#fff;border-radius:8px;text-decoration:none;font-weight:600}.courses{padding:60px 40px}.courses h2{text-align:center;font-size:32px;margin-bottom:40px}.course-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1000px;margin:0 auto}.course{background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 15px rgba(0,0,0,0.04);border-left:4px solid ${color}}.course h3{margin-bottom:8px}.course p{color:#666;font-size:14px;line-height:1.6}.testimonials{padding:60px 40px;background:#fff;text-align:center}.testimonials h2{font-size:32px;margin-bottom:40px}.quotes{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}.quote{background:#f5f7fa;padding:24px;border-radius:12px;max-width:350px;text-align:left}.quote p{font-style:italic;color:#555;line-height:1.6;margin-bottom:12px}.quote .author{font-weight:600;color:${color}}footer{text-align:center;padding:30px;color:#888}</style></head><body><nav><div class="logo">📚 ${name}</div><ul><li><a href="#courses">Courses</a></li><li><a href="#reviews">Reviews</a></li><li><a href="#contact">Contact</a></li></ul><a href="#contact" class="btn">Apply Now</a></nav><section class="hero"><h1>Welcome to <span>${name}</span></h1><p>Empowering students to reach their full potential through quality education.</p><a href="#courses" class="btn">Explore Courses</a></section><section class="courses" id="courses"><h2>Our Programs</h2><div class="course-grid"><div class="course"><h3>🖥️ Computer Science</h3><p>Learn programming, algorithms, and modern software development.</p></div><div class="course"><h3>📐 Mathematics</h3><p>From algebra to calculus — build strong analytical skills.</p></div><div class="course"><h3>🔬 Science Lab</h3><p>Hands-on experiments in physics, chemistry, and biology.</p></div><div class="course"><h3>🎨 Arts & Design</h3><p>Unleash creativity through visual arts and digital design.</p></div></div></section><section class="testimonials" id="reviews"><h2>What Students Say</h2><div class="quotes"><div class="quote"><p>"The best school experience I've had. The teachers truly care."</p><div class="author">— Priya S.</div></div><div class="quote"><p>"Amazing facilities and a supportive community."</p><div class="author">— Rahul M.</div></div></div></section><footer id="contact">© 2025 ${name}. Admissions open!</footer></body></html>`,
  }

  const detectType = (text) => {
    const t = text.toLowerCase()
    if (t.match(/shop|store|product|buy|cart|ecommerce|e-commerce|fashion|clothing|shoe/)) return 'ecommerce'
    if (t.match(/restaurant|cafe|food|menu|dining|kitchen|chef|pizza|burger/)) return 'restaurant'
    if (t.match(/blog|article|post|news|editorial|magazine/)) return 'blog'
    if (t.match(/portfolio|personal|creative|designer|photographer|developer|showcase/)) return 'portfolio'
    if (t.match(/school|college|university|education|student|course|academy|learning/)) return 'school'
    if (t.match(/business|company|agency|corporate|startup|enterprise|consult/)) return 'business'
    if (t.match(/landing|product|saas|app|tool|platform|service/)) return 'landing'
    return 'landing'
  }

  const detectColor = (text) => {
    const t = text.toLowerCase()
    const colors = { blue: '#4F46E5', red: '#DC2626', green: '#059669', purple: '#7C3AED', orange: '#EA580C', pink: '#DB2777', teal: '#0D9488', indigo: '#4338CA', amber: '#D97706', cyan: '#0891B2', black: '#111827', gold: '#B8860B', navy: '#1E3A5F' }
    for (const [name, hex] of Object.entries(colors)) { if (t.includes(name)) return hex }
    return '#4F46E5'
  }

  const detectName = (text) => {
    const patterns = [/(?:for|called|named|titled|name is|brand is)\s+["']?([A-Z][\w\s&]+?)["']?[\s,.]|^["']?([A-Z][\w\s&]+?)["']?\s+(?:website|site|page|landing)/i, /(?:my|the)\s+([A-Z][\w\s]+?)(?:\s+(?:website|site|page|portfolio|blog|shop|store|business|restaurant|school))/i]
    for (const p of patterns) { const m = text.match(p); if (m) return (m[1] || m[2]).trim().slice(0, 30) }
    const words = text.split(/\s+/).filter((w) => w[0] && w[0] === w[0].toUpperCase() && w.length > 2 && !['The', 'This', 'That', 'Create', 'Make', 'Build', 'Design', 'I', 'A', 'An', 'For', 'With', 'And'].includes(w))
    if (words.length > 0) return words.slice(0, 2).join(' ')
    return 'My Website'
  }

  const generate = () => {
    if (!prompt.trim()) return
    setGenerating(true)
    setTimeout(() => {
      const type = detectType(prompt)
      const color = detectColor(prompt)
      const name = detectName(prompt)
      const template = templates[type] || templates.landing
      const code = template(name, color)
      setHtml(code)
      setTimeout(() => { if (iframeRef.current) iframeRef.current.srcdoc = code }, 100)
      setGenerating(false)
    }, 500)
  }

  const download = () => {
    if (!html) return
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const presets = [
    { label: 'Portfolio', prompt: 'Create a portfolio website for a web developer named Alex with dark mode' },
    { label: 'Landing Page', prompt: 'Build a SaaS landing page for a product called TaskFlow with blue theme' },
    { label: 'Restaurant', prompt: 'Make a restaurant website for an Italian place called Bella Vista' },
    { label: 'Blog', prompt: 'Design a tech blog called DevPulse with purple accents' },
    { label: 'Shop', prompt: 'Create an online shoe store called SoleMates with orange theme' },
    { label: 'School', prompt: 'Build a school website for Bright Academy with green colors' },
  ]

  return <div className="card tool-card"><h3>🌐 {s.website.title}</h3>
    <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 12 }}>{s.website.desc}</p>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {presets.map((p) => (
        <button key={p.label} className="btn" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setPrompt(p.prompt)}>{p.label}</button>
      ))}
    </div>
    <div className="tool-grid">
      <label className="field" style={{ gridColumn: '1 / -1' }}>
        <span>{s.website.prompt}</span>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} placeholder={s.website.placeholder} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical' }} />
      </label>
    </div>
    <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
      <button className="btn btn-primary" onClick={generate} disabled={generating || !prompt.trim()}>
        {generating ? s.website.generating : s.website.generate}
      </button>
      <button className="btn" onClick={download} disabled={!html}>
        💾 {s.website.download}
      </button>
      <button className="btn" onClick={() => { setPrompt(''); setHtml(''); if (iframeRef.current) iframeRef.current.srcdoc = '' }}>
        🗑️ {s.website.clear}
      </button>
    </div>
    {html && (
      <div style={{ marginTop: 16, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'white' }}>
        <iframe ref={iframeRef} style={{ width: '100%', height: '400px', border: 'none', background: 'white' }} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title={s.website.preview} />
      </div>
    )}
  </div>
}

export const P3_RENDER = {
  profit: Profit, markup: Markup, breakeven: Breakeven, roi: ROI, change: Change, unitprice: UnitPrice, commission: Commission, billsplit: BillSplit,
  macros: Macros, onerm: OneRM, pace: Pace, steps: Steps, deficit: Deficit, bodyfat: BodyFat,
  baseconv: BaseConv, hexrgb: HexRgb, ascii: Ascii, base64: Base64, urlcode: UrlCode, jsonfmt: JsonFmt, subnet: Subnet, storage: Storage, website: WebsiteBuilder,
  seed: Seed, fertilizer: Fertilizer, pesticide: Pesticide, yield: Yield,
  metronome: Metronome, bpmms: BpmMs, notefreq: Notefreq, interval: Interval,
}
