import { useState } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Assistant from './components/Assistant'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Footer from './components/Footer'
import ParticleNetwork from './components/ParticleNetwork'

function Shell() {
  const { authReady, toast } = useApp()
  const [view, setView] = useState('home')
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (!authReady) return null

  return (
    <>
      <ParticleNetwork />
      <div className="content-layer">
        <Navbar view={view} setView={setView} onOpenSettings={() => setSettingsOpen(true)} />
        {view === 'home' && <Home setView={setView} />}
        {view === 'features' && <Home setView={setView} />}
        {view === 'assistant' && <Assistant />}
        {view === 'login' && <Auth setView={setView} />}
        {view === 'dashboard' && <Dashboard />}
        <Footer setView={setView} />
        {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
