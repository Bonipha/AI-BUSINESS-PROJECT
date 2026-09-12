import { useEffect, useRef, useState } from 'react'
import './AiChat.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const SYSTEM_PROMPT = `You are a helpful shopping assistant for Morrow, a curated marketplace selling small-batch goods — apparel, homeware, and accessories. You can search real products, shops, and categories from the marketplace. Help customers find products, discover shops, explore categories, and answer questions about orders, shipping, and returns. Be warm, concise, and on-brand.`

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Morrow assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          system: SYSTEM_PROMPT,
        }),
      })

      if (!response.ok) throw new Error('No response')
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again shortly.' }])
    } finally {
      setLoading(false)
    }
  }

  function onKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="ai-chat-widget">
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <span className="ai-chat-dot" />
              <div>
                <p className="ai-chat-title">Morrow Assistant</p>
                <p className="ai-chat-subtitle">Search products, shops & more</p>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="ai-chat-bubble assistant ai-chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="ai-chat-input-row">
            <textarea
              className="ai-chat-input"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              disabled={loading}
            />
            <button className="ai-chat-send" onClick={send} disabled={!input.trim() || loading} aria-label="Send">
              ↑
            </button>
          </div>
        </div>
      )}

      <button className="ai-chat-fab" onClick={() => setOpen(o => !o)} aria-label="Open AI chat">
        {open ? '✕' : '✦'}
      </button>
    </div>
  )
}
