import { useState } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Assistant from './components/Assistant'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Tools from './components/Tools'
import Settings from './components/Settings'
import Footer from './components/Footer'
import ParticleUniverse from './components/ParticleUniverse'
import ChatWidget from './components/ChatWidget'

function Shell() {
  const { authReady, toast } = useApp()
  const [view, setView] = useState('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dashTab, setDashTab] = useState(null)
  const [toolsTab, setToolsTab] = useState(null)

  if (!authReady) return null

  const openDashboard = (tab) => {
    setDashTab(tab)
    setView('dashboard')
  }

  const openTools = (tool) => {
    setToolsTab(tool)
    setView('tools')
  }

  return (
    <>
      <ParticleUniverse />
      <div className="content-layer">
        <Navbar view={view} setView={setView} onOpenSettings={() => setSettingsOpen(true)} />
        {view === 'home' && <Home setView={setView} onOpenDashboard={openDashboard} onOpenTools={openTools} />}
        {view === 'features' && <Home setView={setView} onOpenDashboard={openDashboard} onOpenTools={openTools} />}
        {view === 'assistant' && <Assistant />}
        {view === 'login' && <Auth setView={setView} />}
        {view === 'dashboard' && <Dashboard initialTab={dashTab} />}
        {view === 'tools' && <Tools initialTool={toolsTab} />}
        <Footer setView={setView} />
        <ChatWidget />
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
