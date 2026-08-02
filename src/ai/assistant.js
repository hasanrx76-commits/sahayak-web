// Sahayak AI brain.
// 1) Fast offline rule engine (works without internet, in Hindi + English).
// 2) If a Gemini API key is provided, it answers everything else via Gemini free tier.

const MSG = {
  en: {
    hi: (n) => `Hello${n ? ', ' + n : ''}! 👋 How can I help you today?`,
    help: `I can help you with these things:\n\n🕐 Time & date\n🧮 Math (try "what is 25*4")\n😂 Jokes (try "tell me a joke")\n💪 Motivation (try "motivate me")\n🌤 Weather-style tips\n📝 "Remember: ..." to save a note\n📋 "Add task: ..." to create a task\n\nOr open Settings and add a free Gemini API key so I can answer anything!`,
    time: (d) => `The time is ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
    date: (d) => `Today is ${d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
    day: (d) => `Today is ${d.toLocaleDateString(undefined, { weekday: 'long' })}. 🗓`,
    mathNo: `I could not figure that calculation. Try something like "what is 12+7" or "25 percent of 200".`,
    joke1: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
    joke2: 'Why did the developer go broke? Because he used up all his cache! 💸',
    joke3: 'There are only 10 types of people: those who understand binary and those who do not. 😄',
    joke4: 'I told my computer I needed a break, now it will not stop sending me KitKat ads. 🍫',
    motivate: 'You are capable of amazing things! 🔥 Remember: every expert was once a beginner. Keep going, I believe in you! 💪',
    note: (t) => `Got it! 📝 I would save "${t}" as a note, but notes work from your Dashboard tab. Head over there and I will make sure it is saved.`,
    task: (t) => `Done! ✅ "${t}" added to your task list in the Dashboard.`,
    who: 'I am Sahayak — your smart AI assistant built with love. I can talk (voice), chat, remember your notes and manage your tasks. 🤖',
    thanks: 'You are welcome! 😊 Anything else I can do for you?',
    bye: 'Goodbye! See you soon. 👋 Stay awesome!',
    fallback: 'I am not sure about that yet. Try asking me the time, a math question, a joke, or add your free Gemini API key in Settings to unlock my full brain! 🧠',
  },
  hi: {
    hi: (n) => `नमस्ते${n ? ', ' + n : ''}! 👋 आज मैं आपकी कैसे मदद करूँ?`,
    help: `मैं आपकी इन चीज़ों में मदद कर सकता हूँ:\n\n🕐 समय और तारीख\n🧮 गणित (जैसे "25*4 क्या है") \n😂 मज़ाक (जैसे "मज़ाक सुनाओ")\n💪 मोटिवेशन (जैसे "मुझे मोटिवेट करो")\n📝 "याद रखो: ..." लिखने पर नोट बनेगा\n📋 "कार्य जोड़ो: ..." लिखने पर टास्क बनेगा\n\nया Settings में फ्री Gemini API key जोड़िए ताकि मैं कुछ भी जवाब दे सकूँ!`,
    time: (d) => `समय ${d.toLocaleTimeString('hi', { hour: '2-digit', minute: '2-digit' })} है।`,
    date: (d) => `आज ${d.toLocaleDateString('hi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} है।`,
    day: (d) => `आज ${d.toLocaleDateString('hi', { weekday: 'long' })} है। 🗓`,
    mathNo: `मैं यह गणना नहीं समझ पाया। "12+7 क्या है" या "200 का 25 प्रतिशत" जैसा कुछ पूछिए।`,
    joke1: 'प्रोग्रामर डार्क मोड क्यों पसंद करते हैं? क्योंकि लाइट में bugs दिख जाते हैं! 🐛',
    joke2: 'डेवलपर कंगाल क्यों हुआ? क्योंकि उसने अपना पूरा cache खर्च कर दिया! 💸',
    joke3: 'सिर्फ 10 तरह के लोग होते हैं: जो binary समझते हैं और जो नहीं समझते। 😄',
    joke4: 'मैंने कंप्यूटर से कहा मुझे break चाहिए, अब यह मुझे KitKat के ads भेजना बंद नहीं कर रहा। 🍫',
    motivate: 'आप कमाल की चीज़ें कर सकते हैं! 🔥 याद रखिए: हर expert कभी beginner था। बस चलते रहिए, मुझे आप पर भरोसा है! 💪',
    note: (t) => `समझ गया! 📝 मैं "${t}" को नोट की तरह सेव करता, पर नोट्स Dashboard टैब में काम करते हैं। वहाँ जाकर बना लीजिए।`,
    task: (t) => `हो गया! ✅ "${t}" आपके टास्क लिस्ट में Dashboard में जुड़ गया।`,
    who: 'मैं Sahayak हूँ — आपका स्मार्ट AI असिस्टेंट। मैं आवाज़ में बात कर सकता हूँ, चैट कर सकता हूँ, आपके नोट्स याद रखता हूँ और काम मैनेज करता हूँ। 🤖',
    thanks: 'आपका स्वागत है! 😊 और कुछ करूँ आपके लिए?',
    bye: 'अलविदा! फिर मिलेंगे। 👋 खुश रहिए!',
    fallback: 'मुझे अभी इसका पक्का जवाब नहीं पता। समय, गणित, मज़ाक पूछिए, या Settings में फ्री Gemini API key जोड़कर मेरा पूरा दिमाग खोल दीजिए! 🧠',
  },
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function startsWithAny(text, tokens) {
  const lower = text.toLowerCase()
  return tokens.some((tok) => lower.includes(tok))
}

export async function getReply(message, opts = {}) {
  const { lang = 'en', name, geminiKey } = opts
  const d = MSG[lang] || MSG.en
  const m = message.trim()

  // --- Rule engine ---
  const lower = m.toLowerCase()

  if (startsWithAny(lower, ['remember', 'yaad rakh', 'note down', 'note karo', 'save note'])) {
    const note = m.replace(/^(remember|yaad rakh|note down|note karo|save note)[:\s]*/i, '')
    return d.note(note || 'this')
  }

  if (startsWithAny(lower, ['add task', 'add todo', 'karya jodo', 'task jodo', 'todo jodo'])) {
    const task = m.replace(/^(add task|add todo|karya jodo|task jodo|todo jodo)[:\s]*/i, '')
    return d.task(task || 'this')
  }

  if (startsWithAny(lower, ['help', 'madad', 'sahayata', 'kya kar sakte', 'kya kar sakta', 'what can you'])) {
    return d.help
  }

  if (startsWithAny(lower, ['hi', 'hello', 'namaste', 'namaskar', 'hey', 'hola'])) {
    return d.hi(name)
  }

  if (startsWithAny(lower, ['who are you', 'tum kaun', 'aap kaun', 'kya ho'])) {
    return d.who
  }

  if (startsWithAny(lower, ['thank', 'shukriya', 'dhanyavad', 'thanks'])) {
    return d.thanks
  }

  if (startsWithAny(lower, ['bye', 'goodbye', 'alvida', 'phir milenge', 'good night', 'shubh ratri'])) {
    return d.bye
  }

  if (startsWithAny(lower, ['joke', 'chutkula', 'mazak', 'hasao', 'funny'])) {
    return pick([d.joke1, d.joke2, d.joke3, d.joke4])
  }

  if (startsWithAny(lower, ['motivat', 'inspire', 'protsahan', 'himmat', 'tips de'])) {
    return d.motivate
  }

  if (
    startsWithAny(lower, ['time', 'samay', 'kitne baje', 'ghanta']) ||
    (lower.match(/\d/) && /baje|time|o'?clock/.test(lower))
  ) {
    return d.time(new Date())
  }

  if (startsWithAny(lower, ['date', 'tarikh', 'aaj ka din', 'din hai'])) {
    if (startsWithAny(lower, ['day', 'din hai', 'kaun sa din', 'which day'])) return d.day(new Date())
    return d.date(new Date())
  }

  if (startsWithAny(lower, ['day', 'din hai', 'kaun sa din', 'which day', 'weekday'])) {
    return d.day(new Date())
  }

  // Math
  if (startsWithAny(lower, ['what is', 'calculate', 'compute', 'kya hai', 'kitna hoga', '= ?', ' solve'])) {
    const solved = tryMath(m)
    if (solved !== null) return solved
  }

  const pureMath = m.replace(/[+\-*/().%\d ]/g, '')
  if (pureMath === '' && /\d/.test(m) && m.length > 1) {
    const solved = tryMath(m)
    if (solved !== null) return solved
    return d.mathNo
  }

  // Gemini fallback
  if (geminiKey) {
    try {
      const res = await fetchGemini(geminiKey, m, lang, name)
      if (res) return res
    } catch {
      // fall through to fallback
    }
  }

  return d.fallback
}

function tryMath(expr) {
  try {
    let e = expr
      .toLowerCase()
      .replace(/what is|calculate|compute|kya hai|kitna hoga|the value of|solve|equal to|=+/g, ' ')
      .replace(/whats/g, ' ')
      .replace(/x|multiplied by|times|guna/g, '*')
      .replace(/plus|add|jod/g, '+')
      .replace(/minus|subtract|ghata/g, '-')
      .replace(/divided by|divided|bhag/g, '/')
      .replace(/percent|pratishat/g, '/100')
      .replace(/\s+/g, '')
      .replace(/\*\*/g, '*')

    if (!/^[\d+\-*/().%]+$/.test(e)) return null

    const result = Function(`"use strict"; return (${e})`)()
    if (typeof result !== 'number' || !isFinite(result)) return null
    const rounded = Math.round(result * 1000) / 1000
    return `🧮 ${e} = ${rounded}`
  } catch {
    return null
  }
}

async function fetchGemini(apiKey, prompt, lang, name) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
  const sys = `You are Sahayak, a friendly AI assistant. Reply in ${lang === 'hi' ? 'Hindi (in Devanagari script)' : 'English'}. Be concise and helpful. ${name ? `The user's name is ${name}.` : ''} Use emojis occasionally. Keep answers under 120 words.`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: sys + '\n\nUser: ' + prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
    }),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || null
}
