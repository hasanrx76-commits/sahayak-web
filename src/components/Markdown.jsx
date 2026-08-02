// Safe Markdown renderer: parses Markdown → sanitized HTML → highlighted code.
import { useMemo, useEffect, useRef } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'

// Register the most common languages (keeps the bundle small).
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)

marked.setOptions({ gfm: true, breaks: true })

export default function Markdown({ text }) {
  const rootRef = useRef(null)

  // Parse Markdown once per text change, then sanitize to block XSS.
  const html = useMemo(
    () =>
      DOMPurify.sanitize(marked.parse(text || ''), {
        USE_PROFILES: { html: true },
      }),
    [text],
  )

  // Post-process the rendered DOM: highlight code and add copy buttons.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    root.querySelectorAll('pre code').forEach((el) => {
      if (!el.dataset.highlighted) {
        hljs.highlightElement(el)
        el.dataset.highlighted = '1'
      }
    })

    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.code-copy')) return
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'code-copy'
      btn.textContent = '⧉'
      btn.title = 'Copy code'
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText
        navigator.clipboard?.writeText(code).catch(() => {})
        btn.textContent = '✓'
        setTimeout(() => (btn.textContent = '⧉'), 1500)
      })
      pre.appendChild(btn)
    })
  }, [html])

  return <div ref={rootRef} className="md" dangerouslySetInnerHTML={{ __html: html }} />
}
