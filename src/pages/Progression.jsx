import { Lock, RotateCcw } from 'lucide-react'
import BarreXp from '../composants/BarreXp'
import { CONCEPTS } from '../donnees/concepts'
import { EXERCICES } from '../donnees/exercices'
import { JOINTURES } from '../donnees/jointures'
import { QUESTIONS_GENERAL, QUESTIONS_JOINTURES } from '../donnees/quiz'
import { useProgression } from '../hooks/useProgression'
import { BADGES, NIVEAUX } from '../moteur/progression'

function Statistique({ valeur, total, libelle }) {
  return (
    <div className="carte p-4">
      <p className="text-3xl font-bold tabular-nums">
        {valeur}
        <span className="text-lg font-semibold text-doux"> / {total}</span>
      </p>
      <p className="mt-1 text-sm text-doux">{libelle}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface2">
        <div className="h-full rounded-full bg-ok" style={{ width: `${Math.min(100, (valeur / total) * 100)}%` }} />
      </div>
    </div>
  )
}

export default function Progression() {
  const { etat, niveau, envoyer } = useProgression()

  function reinitialiser() {
    if (window.confirm('Effacer toute votre progression (XP, badges, exercices) ? Cette action est définitive.')) {
      envoyer({ type: 'reinitialiser' })
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="titre-page">Votre progression</h1>
        <p className="texte-page">Enregistrée sur cet appareil, même hors ligne.</p>
      </header>

      <BarreXp />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Statistiques">
        <Statistique valeur={etat.exercicesReussis.length} total={EXERCICES.length} libelle="Exercices réussis" />
        <Statistique valeur={etat.conceptsVus.length} total={CONCEPTS.length} libelle="Concepts lus" />
        <Statistique valeur={etat.jointuresVues.length} total={JOINTURES.length} libelle="Jointures vues" />
        <Statistique
          valeur={etat.meilleursQuiz.jointures + etat.meilleursQuiz.general}
          total={QUESTIONS_JOINTURES.length + QUESTIONS_GENERAL.length}
          libelle="Points aux quiz"
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Les niveaux</h2>
        <ol className="carte divide-y divide-bord overflow-hidden">
          {NIVEAUX.map((n) => {
            const atteint = etat.xp >= n.xpRequis
            const actuel = n.id === niveau.id
            return (
              <li
                key={n.id}
                aria-current={actuel ? 'step' : undefined}
                className={`flex items-center gap-4 px-4 py-3.5 sm:px-5 ${actuel ? 'bg-ok/10' : ''} ${atteint ? '' : 'opacity-55'}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface2 text-xl" aria-hidden="true">
                  {atteint ? n.icone : <Lock size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {n.nom}
                    {actuel && <span className="puce ml-2 bg-ok/15 text-ok">Vous êtes ici</span>}
                  </p>
                  <p className="text-sm text-doux">{n.description}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-doux">{n.xpRequis} XP</span>
              </li>
            )
          })}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">
          Les badges{' '}
          <span className="text-base font-semibold text-doux">
            {etat.badges.length} / {BADGES.length}
          </span>
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const obtenu = etat.badges.includes(badge.id)
            return (
              <li
                key={badge.id}
                className={`flex items-center gap-4 rounded-2xl border p-4 ${
                  obtenu ? 'border-ok/40 bg-ok/10' : 'border-bord bg-surface opacity-60'
                }`}
              >
                <span className={`text-3xl ${obtenu ? '' : 'grayscale'}`} aria-hidden="true">
                  {badge.icone}
                </span>
                <div>
                  <p className="font-semibold">{badge.nom}</p>
                  <p className="text-sm text-doux">{badge.condition}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <button type="button" className="btn-secondaire" onClick={reinitialiser}>
        <RotateCcw size={16} aria-hidden="true" /> Réinitialiser ma progression
      </button>
    </div>
  )
}
