import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import DiagrammeVenn from './DiagrammeVenn'
import { JOINTURES } from '../donnees/jointures'
import { useProgression } from '../hooks/useProgression'

// Quiz générique avec correction immédiate et explication après chaque réponse.
// Raccourcis : 1-4 ou A-D pour répondre ; le bouton « suivante » reçoit le focus (Entrée pour continuer).
export default function Quiz({ quiz, titre, questions }) {
  const { etat, envoyer } = useProgression()
  const [index, setIndex] = useState(0)
  const [choix, setChoix] = useState(null)
  const [score, setScore] = useState(0)
  const [termine, setTermine] = useState(false)
  const boutonSuivant = useRef(null)

  const question = questions[index]
  const aRepondu = choix !== null
  const total = questions.length

  function repondre(position) {
    if (aRepondu || position >= question.options.length) return
    setChoix(position)
    if (position === question.reponse) setScore((s) => s + 1)
  }

  function suivante() {
    if (index < total - 1) {
      setIndex(index + 1)
      setChoix(null)
      return
    }
    setTermine(true)
    envoyer({ type: 'quiz-termine', quiz, score, total })
  }

  function recommencer() {
    setIndex(0)
    setChoix(null)
    setScore(0)
    setTermine(false)
  }

  useEffect(() => {
    if (aRepondu) boutonSuivant.current?.focus()
  }, [aRepondu])

  useEffect(() => {
    if (termine) return undefined
    const surTouche = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const position = '1234'.indexOf(e.key) !== -1 ? Number(e.key) - 1 : 'abcd'.indexOf(e.key.toLowerCase())
      if (position >= 0) repondre(position)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  })

  if (termine) {
    const ratio = score / total
    return (
      <div className="carte animate-apparition p-8 text-center sm:p-10">
        <p className="text-6xl" aria-hidden="true">
          {ratio === 1 ? '🏆' : ratio >= 0.7 ? '🎉' : ratio >= 0.4 ? '👍' : '💪'}
        </p>
        <h2 className="mt-4 text-4xl font-bold tabular-nums">
          {score} / {total}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-doux">
          {ratio === 1
            ? 'Sans faute ! Vous maîtrisez ce sujet.'
            : ratio >= 0.7
              ? 'Très bien ! Encore un effort pour le sans-faute.'
              : 'Relisez les explications et rejouez : ça rentre vite.'}
        </p>
        <p className="mt-1 text-sm text-doux">
          Meilleur score : {etat.meilleursQuiz[quiz]} / {total}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primaire" onClick={recommencer}>
            <RotateCcw size={16} aria-hidden="true" /> Rejouer
          </button>
          <a href="#/quiz" className="btn-secondaire">
            Autres quiz
          </a>
        </div>
      </div>
    )
  }

  const jointure = question.jointureId ? JOINTURES.find((j) => j.id === question.jointureId) : null
  const bonne = choix === question.reponse

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">{titre}</span>
        <span className="tabular-nums text-doux">
          {index + 1} / {total}
        </span>
      </div>
      <div className="mb-5 flex gap-1" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total}>
        {questions.map((q, i) => (
          <span
            key={q.question}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < index ? 'bg-ok' : i === index ? 'bg-a' : 'bg-surface2'
            }`}
          />
        ))}
      </div>

      <div className="carte animate-apparition p-5 sm:p-7" key={index}>
        <span className="puce bg-surface2 text-doux">{question.categorie}</span>
        <h2 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">{question.question}</h2>

        <ul className="mt-5 space-y-2.5">
          {question.options.map((option, position) => {
            const estBonne = position === question.reponse
            const estChoisie = position === choix
            let classe = 'border-bord bg-surface hover:border-a/60 hover:bg-a/5'
            if (aRepondu && estBonne) classe = 'border-ok bg-ok/10'
            else if (aRepondu && estChoisie) classe = 'border-erreur bg-erreur/10'
            else if (aRepondu) classe = 'border-bord bg-surface opacity-50'
            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={aRepondu}
                  onClick={() => repondre(position)}
                  className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-medium transition-colors disabled:cursor-default ${classe}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface2 text-xs font-bold text-doux">
                    {aRepondu && estBonne ? (
                      <Check size={15} className="text-ok" aria-label="Bonne réponse" />
                    ) : aRepondu && estChoisie ? (
                      <X size={15} className="text-erreur" aria-label="Mauvaise réponse" />
                    ) : (
                      position + 1
                    )}
                  </span>
                  <span>{option}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {!aRepondu && <p className="mt-4 hidden text-xs text-doux sm:block">Astuce : touches 1 à 4 du clavier.</p>}

        {aRepondu && (
          <div
            className={`mt-5 animate-apparition rounded-2xl border p-4 ${
              bonne ? 'border-ok/40 bg-ok/10' : 'border-erreur/40 bg-erreur/10'
            }`}
            role="status"
          >
            <p className={`font-bold ${bonne ? 'text-ok' : 'text-erreur'}`}>
              {bonne ? 'Bonne réponse !' : 'Pas tout à fait.'}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{question.explication}</p>
            {jointure && (
              <div className="mt-3 flex items-center gap-4 rounded-xl bg-surface p-3">
                <DiagrammeVenn zones={jointure.zones} className="h-20 w-auto shrink-0" />
                <p className="text-sm font-semibold">{jointure.enFrancais}</p>
              </div>
            )}
            <button ref={boutonSuivant} type="button" className="btn-primaire mt-4 w-full sm:w-auto" onClick={suivante}>
              {index < total - 1 ? 'Question suivante' : 'Voir mon score'}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
