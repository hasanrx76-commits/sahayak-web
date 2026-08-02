import { useEffect, useRef, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { getReply } from '../ai/assistant'
import { useSpeech } from '../hooks/useSpeech'

export default function Assistant() {
  const { t, lang, voiceReplies, geminiKey, user } = useApp()
  const { listening, speaking, supported, speak, stopSpeaking, startListening, stopListening } =
    useSpeech()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const areaRef = useRef(null)

  useEffect(() => {
    if (messages.length === 0) {
      const hello = t('assistant.hello')
      setMessages([{ role: 'ai', text: hello }])
      if (voiceReplies) setTimeout(() => speak(hello, lang), 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight
    }
  }, [messages, thinking])

  const handleReply = async (text) => {
    if (!text.trim() || thinking) return
    const userMsg = { role: 'user', text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)

    const replyText = await getReply(text, {
      lang,
      name: user?.displayName?.split(' ')[0] || user?.email || '',
      geminiKey,
    })

    setMessages((m) => [...m, { role: 'ai', text: replyText }])
    setThinking(false)
    if (voiceReplies) {
      speak(replyText, lang)
    }
  }

  const onVoiceResult = (transcript) => {
    if (transcript) handleReply(transcript)
  }

  const toggleMic = () => {
    if (listening) {
      stopListening()
      return
    }
    stopSpeaking()
    startListening(onVoiceResult, lang)
  }

  return (
    <section className="section" id="assistant" style={{ paddingTop: 110 }}>
      <div className="container">
        <div className="assistant-wrap">
          <h2 className="section-title">{t('assistant.title')}</h2>
          <p className="section-sub">{t('assistant.sub')}</p>

          <div className="assistant-shell">
            <div className="assistant-head">
              <div className={`avatar ${listening ? 'pulse' : ''}`}>
                {speaking ? '🔊' : listening ? '🎤' : '🤖'}
              </div>
              <div>
                <div className="assistant-name">Sahayak</div>
                <div className="assistant-status">
                  <span className={`dot ${listening ? 'listening' : ''}`} />
                  {listening ? t('assistant.listening') : speaking ? t('assistant.speaking') : 'Online'}
                </div>
              </div>
            </div>

            <div className="chat-area" ref={areaRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                  {m.text}
                </div>
              ))}
              {thinking && (
                <div className="msg msg-ai">
                  <span className="typing">
                    <span /> <span /> <span />
                  </span>
                </div>
              )}
            </div>

            <div className="assistant-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReply(input)}
                placeholder={t('assistant.placeholder')}
              />
              <button
                className={`mic-btn ${listening ? 'recording' : ''}`}
                onClick={toggleMic}
                disabled={!supported}
                title={t('assistant.listening')}
              >
                {listening ? '🛑' : '🎙️'}
              </button>
              <button className="send-btn" onClick={() => handleReply(input)} title={t('assistant.send')}>
                ➤
              </button>
            </div>
          </div>
          {!supported && <p style={{ color: 'var(--danger)', textAlign: 'center', marginTop: 14 }}>{t('assistant.unsupported')}</p>}
        </div>
      </div>
    </section>
  )
}
