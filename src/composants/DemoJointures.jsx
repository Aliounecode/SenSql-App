import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import DiagrammeVenn from './DiagrammeVenn'
import { JOINTURES } from '../donnees/jointures'

const DUREE_MS = 3200

// Le cœur de l'accueil : le diagramme passe d'une jointure à l'autre, avec sa phrase en français.
export default function DemoJointures() {
  const [index, setIndex] = useState(0)
  const [enPause, setEnPause] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (enPause) return undefined
    const minuteur = setInterval(() => setIndex((i) => (i + 1) % JOINTURES.length), DUREE_MS)
    return () => clearInterval(minuteur)
  }, [enPause])

  const jointure = JOINTURES[index]

  function choisir(position) {
    setIndex(position)
    setEnPause(true)
  }

  return (
    <div className="carte overflow-hidden">
      <div className="bg-gradient-to-br from-a/10 via-transparent to-b/10 p-5 pb-3 sm:p-7 sm:pb-4">
        <DiagrammeVenn zones={jointure.zones} className="mx-auto h-auto w-full max-w-sm" />
      </div>
      <div className="px-5 pb-5 sm:px-7 sm:pb-6">
        <p className="font-code text-sm font-semibold text-ok" aria-live="off">
          {jointure.nom}
        </p>
        <p className="mt-1 min-h-[3.25rem] text-lg font-semibold leading-snug">{jointure.enFrancais}</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 flex-wrap gap-1.5" role="group" aria-label="Choisir une jointure">
            {JOINTURES.map((j, position) => (
              <button
                key={j.id}
                type="button"
                onClick={() => choisir(position)}
                aria-label={j.nom}
                aria-pressed={position === index}
                className="group flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all ${
                    position === index ? 'w-6 bg-ok' : 'w-2.5 bg-bord group-hover:bg-doux'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEnPause((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-doux hover:text-texte"
            aria-label={enPause ? 'Relancer le défilement' : 'Mettre en pause'}
          >
            {enPause ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  )
}
