import { useRegisterSW } from 'virtual:pwa-register/react'

// Bandeau affiché quand l'appli est prête hors ligne ou qu'une nouvelle version est disponible.
export default function BandeauMiseAJour() {
  const {
    offlineReady: [pretHorsLigne, setPretHorsLigne],
    needRefresh: [miseAJour, setMiseAJour],
    updateServiceWorker,
  } = useRegisterSW()

  if (!pretHorsLigne && !miseAJour) return null

  function fermer() {
    setPretHorsLigne(false)
    setMiseAJour(false)
  }

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-md animate-apparition items-center gap-3 rounded-2xl border border-bord bg-surface p-3 pl-4 shadow-leve lg:bottom-6 lg:left-auto lg:right-6 lg:mx-0"
    >
      <p className="flex-1 text-sm font-medium">
        {miseAJour ? 'Une nouvelle version de SENSqL est prête.' : 'SENSqL fonctionne maintenant hors ligne.'}
      </p>
      {miseAJour && (
        <button type="button" className="btn-primaire px-3" onClick={() => updateServiceWorker(true)}>
          Mettre à jour
        </button>
      )}
      <button type="button" className="btn-secondaire px-3" onClick={fermer}>
        {miseAJour ? 'Plus tard' : 'OK'}
      </button>
    </div>
  )
}
