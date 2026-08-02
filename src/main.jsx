import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

const fallback = (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
    <div>
      <div style={{ fontSize: 48 }}>😕</div>
      <h2 style={{ margin: '12px 0 8px' }}>Kuch gadbad ho gayi</h2>
      <p style={{ color: '#888', maxWidth: 420 }}>
        Ek unexpected error aa gaya. Refresh karke dobara try karein.
      </p>
      <button
        style={{ marginTop: 16, padding: '10px 22px', borderRadius: 10, border: 0, background: '#6c5ce7', color: '#fff', cursor: 'pointer' }}
        onClick={() => window.location.reload()}
      >
        🔄 Refresh
      </button>
    </div>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
