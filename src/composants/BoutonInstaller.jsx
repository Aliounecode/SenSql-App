import { Download, Share } from 'lucide-react'
import { useInstallationPwa } from '../hooks/useInstallationPwa'

export default function BoutonInstaller({ className = '' }) {
  const { peutInstaller, installee, estIos, installer } = useInstallationPwa()

  if (installee) return null

  if (peutInstaller) {
    return (
      <button type="button" onClick={installer} className={`btn-secondaire ${className}`}>
        <Download size={16} aria-hidden="true" />
        Installer l’appli
      </button>
    )
  }

  if (estIos) {
    return (
      <p className={`flex items-start gap-2 text-sm text-doux ${className}`}>
        <Share size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        <span>
          Sur iPhone : touchez <strong>Partager</strong>, puis <strong>Sur l’écran d’accueil</strong>.
        </span>
      </p>
    )
  }

  return null
}
