import { useEffect } from 'react'
import { useProgression } from '../hooks/useProgression'

// Affiche tour à tour les nouveaux badges et changements de niveau.
export default function NotificationRecompense() {
  const { etat, envoyer } = useProgression()
  const notification = etat.notifications[0]
  const idNotification = notification?.id

  useEffect(() => {
    if (idNotification === undefined) return undefined
    const minuteur = setTimeout(() => {
      envoyer({ type: 'notification-fermee', id: idNotification })
    }, 4200)
    return () => clearTimeout(minuteur)
  }, [idNotification, envoyer])

  if (!notification) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 top-16 z-[60] mx-auto max-w-sm animate-apparition lg:top-5"
    >
      <button
        type="button"
        onClick={() => envoyer({ type: 'notification-fermee', id: notification.id })}
        className="flex w-full items-center gap-3 rounded-2xl border border-ok/40 bg-surface p-3.5 text-left shadow-leve"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ok/15 text-2xl" aria-hidden="true">
          {notification.icone}
        </span>
        <span>
          <span className="block text-xs font-semibold text-ok">{notification.titre}</span>
          <span className="block font-bold leading-snug">{notification.texte}</span>
        </span>
      </button>
    </div>
  )
}
