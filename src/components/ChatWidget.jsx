// Floating AI chat widget: bottom-right button + modern chat window.
// Features: real-time streaming, conversation history, typing indicator,
// Markdown rendering, error handling, responsive, dark/light aware.
import { useEffect, useRef, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { chatStream } from '../lib/chatApi'
import Markdown from './Markdown'

const WELCOME = {
  en: "Hi! I'm **Sahayak AI** 🤖 — I know everything about this website. Ask me about **features**, **pricing**, **how to use it**, or anything else!",
  hi: 'नमस्ते! मैं **Sahayak AI** हूँ 🤖 — मुझे इस वेबसाइट की सब जानकारी है। **फीचर्स**, **प्राइसिंग**, या **कैसे उपयोग करें** — कुछ भी पूछिए!',
}

export default function ChatWidget() {
  const { lang } = useApp()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [{ role: 'assistant', content: WELCOME.en }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [error, setError] = useState('')
  const [unread, setUnread] = useState(false)

  const bodyRef = useRef(null)
  const openRef = useRef(false)
  // Streaming is throttled to one React update per animation frame.
  const pendingRef = useRef(null)
  const rafRef = useRef(0)
  const abortRef = useRef(null)

  // Keep the fab badge / close state in sync.
  useEffect(() => {
    openRef.current = open
  }, [open])

  // Allow other parts of the app (e.g. the Smart Chat feature card) to open the chat.
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('sahayak-open-chat', onOpen)
    return () => window.removeEventListener('sahayak-open-chat', onOpen)
  }, [])

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  // Throttled DOM update for streamed text.
  const flush = () => {
    rafRef.current = 0
    const p = pendingRef.current
    if (!p) return
    pendingRef.current = null
    setMessages((ms) => ms.map((m, i) => (i === p.index ? { ...m, content: p.text } : m)))
  }

  const pushChunk = (index, text) => {
    pendingRef.current = { index, text }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(flush)
  }

  const send = async (raw) => {
    const text = (raw || input).trim()
    if (!text || typing) return
    setError('')

    const history = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setInput('')

    const aiIndex = history.length
    setMessages((m) => [...m, { role: 'assistant', content: '' }])
    setTyping(true)

    let acc = ''
    try {
      const controller = new AbortController()
      abortRef.current = controller
      await chatStream({
        messages: history,
        onChunk: (chunk) => {
          acc += chunk
          pushChunk(aiIndex, acc)
        },
        signal: controller.signal,
      })
      if (!openRef.current) setUnread(true)
    } catch (err) {
      if (err.name !== 'AbortError') {
        const msg = err.message || 'Something went wrong.'
        setError(msg)
        // Show the error inside the bubble so it is never empty.
        pushChunk(aiIndex, acc ? `${acc}\n\n> ⚠️ ${msg}` : `> ⚠️ ${msg}`)
      }
    } finally {
      abortRef.current = null
      flush()
      setTyping(false)
    }
  }

  const toggle = () => {
    setOpen((o) => !o)
    setUnread(false)
    setTimeout(() => {
      const el = bodyRef.current
      if (el) el.scrollTop = el.scrollHeight
    }, 60)
  }

  return (
    <>
      {/* Floating action button */}
      <button className="chat-fab" onClick={toggle} aria-label="Open AI chat" title="Ask Sahayak AI">
        {open ? '✕' : '🤖'}
        {!open && unread && <span className="chat-badge" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chat-window" role="dialog" aria-label="AI chat">
          <div className="chat-head">
            <div className="avatar">🤖</div>
            <div>
              <div className="assistant-name">Sahayak AI</div>
              <div className="assistant-status">
                <span className="dot" /> Online
              </div>
            </div>
            <button className="btn-icon" onClick={() => setOpen(false)} title="Close">
              ✕
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                {m.role === 'assistant' ? (
                  <Markdown text={m.content} />
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                )}
              </div>
            ))}
            {typing && (
              <div className="msg msg-ai">
                <span className="typing">
                  <span /> <span /> <span />
                </span>
              </div>
            )}
          </div>

          <div className="chat-foot">
            {error && <div className="chat-error">⚠️ {error}</div>}
            <div className="assistant-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder={lang === 'hi' ? 'वेबसाइट के बारे में पूछिए...' : 'Ask about the website...'}
                aria-label="Chat message"
              />
              <button className="send-btn" onClick={() => send()} disabled={typing} title="Send">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
