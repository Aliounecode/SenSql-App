import { useCallback, useEffect, useState } from 'react'

function dejaInstallee() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
}

// Gère le bouton « Installer l'appli » :
//  - Android / Chrome / Edge : l'événement `beforeinstallprompt` permet un vrai bouton d'installation
//  - iOS (Safari) : pas d'événement, on explique le geste « Partager → Sur l'écran d'accueil »
export function useInstallationPwa() {
  const [evenement, setEvenement] = useState(null)
  const [installee, setInstallee] = useState(dejaInstallee)
  const [estIos] = useState(() => /iphone|ipad|ipod/i.test(navigator.userAgent))

  useEffect(() => {
    const surInvite = (e) => {
      e.preventDefault()
      setEvenement(e)
    }
    const surInstallation = () => {
      setInstallee(true)
      setEvenement(null)
    }
    window.addEventListener('beforeinstallprompt', surInvite)
    window.addEventListener('appinstalled', surInstallation)
    return () => {
      window.removeEventListener('beforeinstallprompt', surInvite)
      window.removeEventListener('appinstalled', surInstallation)
    }
  }, [])

  const installer = useCallback(async () => {
    if (!evenement) return
    await evenement.prompt()
    await evenement.userChoice
    setEvenement(null)
  }, [evenement])

  return { peutInstaller: evenement !== null, installee, estIos, installer }
}
