import { Suspense, lazy, useEffect } from 'react'
import BandeauMiseAJour from './composants/BandeauMiseAJour'
import Chargement from './composants/Chargement'
import ErreurBoundary from './composants/ErreurBoundary'
import { BarreBas, BarreHaut, MenuLateral } from './composants/Navigation'
import NotificationRecompense from './composants/NotificationRecompense'
import ProgressionFournisseur from './contexte/ProgressionFournisseur'
import { useRoute } from './hooks/useRoute'
import Accueil from './pages/Accueil'
import Concepts from './pages/Concepts'
import Progression from './pages/Progression'
import QuizPage from './pages/QuizPage'

// Les pages qui utilisent le moteur SQL sont chargées à la demande (le moteur .wasm n'est donc téléchargé
// que lorsqu'on en a besoin).
const Jointures = lazy(() => import('./pages/Jointures'))
const Editeur = lazy(() => import('./pages/Editeur'))
const Exercices = lazy(() => import('./pages/Exercices'))

const PAGES = {
  '': Accueil,
  jointures: Jointures,
  concepts: Concepts,
  editeur: Editeur,
  exercices: Exercices,
  quiz: QuizPage,
  progression: Progression,
}

function Contenu() {
  const route = useRoute()
  const Page = PAGES[route.segments[0] ?? ''] ?? Accueil
  const racine = route.segments[0] ?? ''

  // Remonter en haut de page quand on change de section (pas quand on change d'onglet dans la même page)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.chemin])

  return (
    <>
      <MenuLateral cheminCourant={route.chemin} />
      <BarreHaut />

      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-10 lg:py-10 lg:pb-12">
          <ErreurBoundary key={route.cle}>
            <Suspense fallback={<Chargement message="Démarrage du moteur SQL…" />}>
              <div key={racine} className="animate-apparition">
                <Page segments={route.segments} params={route.params} />
              </div>
            </Suspense>
          </ErreurBoundary>
        </main>

        <footer className="hidden border-t border-bord px-10 py-5 text-xs text-doux lg:block">
          Créé par <strong className="font-semibold text-texte">Alioune Badara Diop</strong> · © 2026 SENSqL
        </footer>
      </div>

      <BarreBas cheminCourant={route.chemin} />
      <NotificationRecompense />
      <BandeauMiseAJour />
    </>
  )
}

export default function App() {
  return (
    <ProgressionFournisseur>
      <Contenu />
    </ProgressionFournisseur>
  )
}
