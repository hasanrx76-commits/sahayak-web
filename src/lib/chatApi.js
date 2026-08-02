// Streaming client for the /api/chat serverless endpoint.
// Parses Server-Sent Events (SSE) and calls onChunk(text) for each piece.

function extractText(payload) {
  if (!payload) return ''
  // OpenAI stream format
  if (Array.isArray(payload.choices)) {
    const choice = payload.choices[0]
    if (!choice) return ''
    return choice.delta?.content || choice.message?.content || ''
  }
  // Gemini stream format
  if (Array.isArray(payload.candidates)) {
    const parts = payload.candidates[0]?.content?.parts
    if (!parts) return ''
    return parts.map((p) => p.text || '').join('')
  }
  return ''
}

function consumeLine(line, onChunk) {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data:')) return
  const data = trimmed.slice(5).trim()
  if (!data || data === '[DONE]') return
  try {
    const text = extractText(JSON.parse(data))
    if (text) onChunk(text)
  } catch {
    // Ignore malformed frames (e.g. partial JSON).
  }
}

export async function chatStream({ messages, onChunk, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const json = await res.json()
      if (json.error) msg = json.error
    } catch {
      // Keep default message.
    }
    throw new Error(msg)
  }

  // Guard against non-SSE responses (e.g. dev server serving index.html).
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('text/event-stream')) {
    throw new Error('Chat backend unavailable. Run `npx vercel dev` locally, or check the deployed API.')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let idx
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)
      consumeLine(line, onChunk)
    }
  }
  if (buffer.trim()) consumeLine(buffer, onChunk)
}
