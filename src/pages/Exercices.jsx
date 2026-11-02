import { use, useState } from 'react'
import { ArrowRight, Check, Circle, Eye, Lightbulb } from 'lucide-react'
import BlocSql from '../composants/BlocSql'
import { DIFFICULTES, EXERCICES } from '../donnees/exercices'
import { useProgression } from '../hooks/useProgression'
import { TABLES_DOC, chargerSql } from '../moteur/baseSql'
import { verifierExercice } from '../moteur/verification'
import { lienEditeur } from '../routage'

const TENTATIVES_AVANT_SOLUTION = 2

export default function Exercices() {
  const SQL = use(chargerSql())
  const { etat, envoyer } = useProgression()

  const [index, setIndex] = useState(() => {
    const premierNonFait = EXERCICES.findIndex((e) => !etat.exercicesReussis.includes(e.id))
    return premierNonFait === -1 ? 0 : premierNonFait
  })
  const [reponses, setReponses] = useState({})
  const [verdicts, setVerdicts] = useState({})
  const [tentatives, setTentatives] = useState({})
  const [indicesOuverts, setIndicesOuverts] = useState({})
  const [solutionsOuvertes, setSolutionsOuvertes] = useState({})

  const exercice = EXERCICES[index]
  const difficulte = DIFFICULTES[exercice.difficulte]
  const reussi = etat.exercicesReussis.includes(exercice.id)
  const verdict = verdicts[exercice.id]
  const nbTentatives = tentatives[exercice.id] ?? 0
  const solutionDisponible = nbTentatives >= TENTATIVES_AVANT_SOLUTION || reussi

  function modifierReponse(texte) {
    setReponses((courant) => ({ ...courant, [exercice.id]: texte }))
  }

  function verifier() {
    const resultat = verifierExercice(SQL, exercice, reponses[exercice.id] ?? '')
    setVerdicts((courant) => ({ ...courant, [exercice.id]: resultat }))
    if (resultat.ok) {
      envoyer({ type: 'exercice-reussi', id: exercice.id, xp: difficulte.xp })
    } else {
      setTentatives((courant) => ({ ...courant, [exercice.id]: (courant[exercice.id] ?? 0) + 1 }))
    }
  }

  function surTouche(evenement) {
    if ((evenement.ctrlKey || evenement.metaKey) && evenement.key === 'Enter') {
      evenement.preventDefault()
      verifier()
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="titre-page">Exercices</h1>
        <p className="texte-page">
          Votre requête est exécutée sur la base d’exemple puis comparée à la solution : plusieurs écritures sont
          acceptées. {etat.exercicesReussis.length} / {EXERCICES.length} réussis.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        {/* Liste des exercices : puces défilantes sur mobile, liste verticale sur ordinateur */}
        <nav aria-label="Liste des exercices" className="lg:sticky lg:top-6 lg:self-start">
          <ol className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:block lg:space-y-0.5 lg:overflow-visible lg:px-0">
            {EXERCICES.map((e, position) => {
              const fait = etat.exercicesReussis.includes(e.id)
              const actif = position === index
              return (
                <li key={e.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(position)}
                    aria-label={`Exercice ${position + 1} : ${e.titre}${fait ? ' (réussi)' : ''}`}
                    aria-current={actif ? 'step' : undefined}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors ${
                      actif ? 'bg-texte text-fond' : 'bg-surface text-doux hover:bg-surface2 hover:text-texte lg:bg-transparent'
                    }`}
                  >
                    {fait ? (
                      <Check size={16} className={actif ? '' : 'text-ok'} aria-hidden="true" />
                    ) : (
                      <Circle size={16} className="opacity-40" aria-hidden="true" />
                    )}
                    <span className="tabular-nums lg:hidden">{position + 1}</span>
                    <span className="hidden truncate lg:inline">
                      {position + 1}. {e.titre}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        <section className="carte space-y-5 p-5 sm:p-7" key={exercice.id}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="puce bg-surface2 text-doux">{exercice.categorie}</span>
            <span className={`puce ${difficulte.classe}`}>{difficulte.libelle}</span>
            <span className="ml-auto text-sm font-semibold text-ok">+{difficulte.xp} XP</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">{exercice.titre}</h2>
            <p className="mt-2 text-lg leading-relaxed">{exercice.enonce}</p>
          </div>

          <details className="group rounded-xl bg-surface2 px-3.5 py-2.5 text-sm">
            <summary className="cursor-pointer select-none font-semibold text-doux group-open:text-texte">
              Rappel des tables
            </summary>
            <ul className="mt-2 space-y-1 font-code text-xs leading-relaxed">
              {TABLES_DOC.map((t) => (
                <li key={t.nom}>
                  <strong>{t.nom}</strong> <span className="text-doux">({t.colonnes.join(', ')})</span>
                </li>
              ))}
            </ul>
          </details>

          <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0d1220]">
            <label htmlFor="reponse" className="sr-only">
              Votre requête
            </label>
            <textarea
              id="reponse"
              value={reponses[exercice.id] ?? ''}
              onChange={(e) => modifierReponse(e.target.value)}
              onKeyDown={surTouche}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              rows={6}
              className="block w-full resize-y bg-transparent p-4 font-code text-sm leading-relaxed text-slate-100 caret-emerald-300 outline-none placeholder:text-slate-600"
              placeholder="Écrivez votre requête SQL ici…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button type="button" className="btn-primaire" onClick={verifier}>
              <Check size={16} aria-hidden="true" /> Vérifier
            </button>
            <button
              type="button"
              className="btn-secondaire"
              onClick={() => setIndicesOuverts((c) => ({ ...c, [exercice.id]: true }))}
            >
              <Lightbulb size={16} aria-hidden="true" /> Indice
            </button>
            <a href={lienEditeur(reponses[exercice.id] ?? '')} className="btn-secondaire">
              Tester dans l’éditeur
            </a>
            <span className="hidden text-xs text-doux sm:inline">Ctrl / ⌘ + Entrée</span>
          </div>

          {indicesOuverts[exercice.id] && (
            <p className="rounded-xl border border-alerte/40 bg-alerte/10 p-3 font-code text-sm">{exercice.indice}</p>
          )}

          <div aria-live="polite">
            {verdict && (
              <div
                className={`animate-apparition rounded-2xl border p-4 ${
                  verdict.ok ? 'border-ok/40 bg-ok/10' : 'border-erreur/40 bg-erreur/10'
                }`}
                role="status"
              >
                <p className={`font-bold ${verdict.ok ? 'text-ok' : 'text-erreur'}`}>
                  {verdict.ok ? `Correct ! +${difficulte.xp} XP` : 'Pas encore.'}
                </p>
                {!verdict.ok && <p className="mt-1 text-sm">{verdict.message}</p>}
              </div>
            )}
          </div>

          {!solutionDisponible && (
            <p className="text-sm text-doux">
              La solution se débloque après {TENTATIVES_AVANT_SOLUTION} essais ({nbTentatives}/
              {TENTATIVES_AVANT_SOLUTION}).
            </p>
          )}

          {solutionDisponible &&
            (solutionsOuvertes[exercice.id] ? (
              <BlocSql titre="Solution" code={exercice.solution} />
            ) : (
              <button
                type="button"
                className="btn-secondaire"
                onClick={() => setSolutionsOuvertes((c) => ({ ...c, [exercice.id]: true }))}
              >
                <Eye size={16} aria-hidden="true" /> Voir la solution
              </button>
            ))}

          {(reussi || verdict?.ok) && index < EXERCICES.length - 1 && (
            <button type="button" className="btn-primaire w-full sm:w-auto" onClick={() => setIndex(index + 1)}>
              Exercice suivant <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
