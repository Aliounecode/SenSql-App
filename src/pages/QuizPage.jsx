import { ArrowLeft, ArrowRight, GitMerge, BookOpen } from 'lucide-react'
import Quiz from '../composants/Quiz'
import { QUESTIONS_GENERAL, QUESTIONS_JOINTURES } from '../donnees/quiz'
import { useProgression } from '../hooks/useProgression'

const QUIZ = {
  jointures: {
    titre: 'Quiz des jointures',
    description: 'Quelle jointure pour quel besoin ? Le diagramme de la bonne réponse s’affiche après chaque question.',
    questions: QUESTIONS_JOINTURES,
    Icone: GitMerge,
    teinte: 'bg-a/15 text-a',
  },
  general: {
    titre: 'Quiz général SQL',
    description: 'DDL, DML, DCL, TCL, fonctions, vues, index, procédures stockées et triggers.',
    questions: QUESTIONS_GENERAL,
    Icone: BookOpen,
    teinte: 'bg-b/15 text-b',
  },
}

function ChoixQuiz() {
  const { etat } = useProgression()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="titre-page">Les quiz</h1>
        <p className="texte-page">
          Chaque bonne réponse rapporte 10 XP, une seule fois par question. Battez votre meilleur score pour en
          gagner davantage.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Object.entries(QUIZ).map(([cle, quiz]) => {
          const meilleur = etat.meilleursQuiz[cle]
          const total = quiz.questions.length
          return (
            <a key={cle} href={`#/quiz/${cle}`} className="carte-cliquable flex flex-col gap-3 p-6">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${quiz.teinte}`}>
                <quiz.Icone size={22} aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold">{quiz.titre}</h2>
              <p className="text-sm leading-relaxed text-doux">{quiz.description}</p>
              <div className="mt-auto pt-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>
                    {meilleur > 0 ? `Meilleur score : ${meilleur} / ${total}` : `${total} questions`}
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface2">
                  <div className="h-full rounded-full bg-ok" style={{ width: `${(meilleur / total) * 100}%` }} />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function QuizPage({ segments }) {
  const cle = segments[1]
  const quiz = QUIZ[cle]

  if (!quiz) return <ChoixQuiz />

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <a href="#/quiz" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-doux hover:text-texte">
        <ArrowLeft size={16} aria-hidden="true" /> Tous les quiz
      </a>
      <Quiz key={cle} quiz={cle} titre={quiz.titre} questions={quiz.questions} />
    </div>
  )
}
