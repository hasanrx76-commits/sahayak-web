import { useEffect, useState } from 'react'

export function usePwaInstall() {
  const [deferred, setDeferred] = useState(null)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    const onInstalled = () => setDeferred(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferred) return false
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    return true
  }

  return { canInstall: Boolean(deferred), promptInstall }
}
