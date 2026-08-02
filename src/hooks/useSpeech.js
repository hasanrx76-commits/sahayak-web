import { useState, useEffect, useRef, useCallback } from 'react'

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  return SR ? new SR() : null
}

export function useSpeech() {
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const recRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    synthRef.current = window.speechSynthesis || null
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setSupported(Boolean(SR && synthRef.current))
  }, [])

  const speak = useCallback((text, lang = 'en') => {
    const synth = synthRef.current
    if (!synth || !text) return
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text.replace(/[#*_`]/g, ''))
    utter.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
    utter.rate = 1
    utter.pitch = 1.05
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    setSpeaking(true)
    synth.speak(utter)
  }, [])

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel()
    setSpeaking(false)
  }, [])

  const startListening = useCallback(
    (onResult, lang = 'en') => {
      const rec = getSpeechRecognition()
      if (!rec) {
        setSupported(false)
        return
      }
      recRef.current = rec
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 1

      rec.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript || ''
        setListening(false)
        if (transcript) onResult(transcript)
      }
      rec.onerror = (e) => {
        setListening(false)
        if (e.error === 'no-speech') onResult(null)
      }
      rec.onend = () => {
        setListening(false)
      }

      try {
        rec.start()
        setListening(true)
      } catch {
        setListening(false)
      }
    },
    [],
  )

  const stopListening = useCallback(() => {
    try {
      recRef.current?.stop()
    } catch {}
    setListening(false)
  }, [])

  return { listening, speaking, supported, speak, stopSpeaking, startListening, stopListening }
}
