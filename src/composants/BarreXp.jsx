import { useProgression } from '../hooks/useProgression'
import { avancementNiveau } from '../moteur/progression'

// Barre de progression compacte (menu) ou détaillée (page Progression).
export default function BarreXp({ compact = false }) {
  const { etat } = useProgression()
  const { niveau, suivant, pourcentage, restant } = avancementNiveau(etat.xp)

  const barre = (
    <div
      className="h-2 overflow-hidden rounded-full bg-surface2"
      role="progressbar"
      aria-valuenow={Math.round(pourcentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progression vers le niveau suivant"
    >
      <div className="h-full rounded-full bg-ok transition-all duration-700" style={{ width: `${pourcentage}%` }} />
    </div>
  )

  if (compact) {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-2 text-sm">
          <span className="font-semibold">
            <span aria-hidden="true">{niveau.icone}</span> {niveau.nom}
          </span>
          <span className="text-xs font-semibold text-doux">{etat.xp} XP</span>
        </div>
        <div className="mt-2">{barre}</div>
      </div>
    )
  }

  return (
    <div className="carte p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ok/15 text-2xl" aria-hidden="true">
            {niveau.icone}
          </span>
          <div>
            <p className="text-sm text-doux">Niveau {niveau.id}</p>
            <p className="text-xl font-bold leading-tight">{niveau.nom}</p>
          </div>
        </div>
        <p className="text-right">
          <span className="text-3xl font-bold tabular-nums">{etat.xp}</span>
          <span className="ml-1 text-sm font-semibold text-doux">XP</span>
        </p>
      </div>
      <div className="mt-5">{barre}</div>
      <p className="mt-2 text-sm text-doux">
        {suivant ? `Encore ${restant} XP pour devenir « ${suivant.nom} »` : 'Niveau maximum atteint, bravo !'}
      </p>
    </div>
  )
}
