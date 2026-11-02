import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Brain, Ellipsis, GitMerge, House, Target, Terminal, Trophy, X } from 'lucide-react'
import BarreXp from './BarreXp'
import BoutonInstaller from './BoutonInstaller'
import BoutonTheme from './BoutonTheme'
import Logo from './Logo'
import { useProgression } from '../hooks/useProgression'

const GROUPES = [
  {
    titre: 'Apprendre',
    elements: [
      { chemin: '/', libelle: 'Accueil', Icone: House },
      { chemin: '/jointures', libelle: 'Jointures', Icone: GitMerge },
      { chemin: '/concepts', libelle: 'Concepts', Icone: BookOpen },
    ],
  },
  {
    titre: 'S’entraîner',
    elements: [
      { chemin: '/editeur', libelle: 'Éditeur SQL', Icone: Terminal },
      { chemin: '/exercices', libelle: 'Exercices', Icone: Target },
      { chemin: '/quiz', libelle: 'Quiz', Icone: Brain },
    ],
  },
  {
    titre: 'Moi',
    elements: [{ chemin: '/progression', libelle: 'Progression', Icone: Trophy }],
  },
]

const TOUS = GROUPES.flatMap((g) => g.elements)
const PRINCIPAUX = ['/', '/jointures', '/editeur', '/exercices']

function estActif(chemin, cheminCourant) {
  return chemin === '/' ? cheminCourant === '/' : cheminCourant.startsWith(chemin)
}

// Menu latéral (ordinateur)
export function MenuLateral({ cheminCourant }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-bord bg-surface lg:flex">
      <a href="#/" className="flex items-center gap-3 px-5 pb-4 pt-6" aria-label="SENSqL — accueil">
        <Logo hauteur={30} />
        <span className="text-2xl font-bold tracking-tight">SENSqL</span>
      </a>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3" aria-label="Navigation principale">
        {GROUPES.map((groupe) => (
          <div key={groupe.titre}>
            <p className="px-3 pb-1.5 text-xs font-semibold text-doux">{groupe.titre}</p>
            <ul className="space-y-0.5">
              {groupe.elements.map(({ chemin, libelle, Icone }) => {
                const actif = estActif(chemin, cheminCourant)
                return (
                  <li key={chemin}>
                    <a
                      href={`#${chemin}`}
                      aria-current={actif ? 'page' : undefined}
                      className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                        actif ? 'bg-ok/15 text-ok' : 'text-doux hover:bg-surface2 hover:text-texte'
                      }`}
                    >
                      <Icone size={18} aria-hidden="true" />
                      {libelle}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-4 border-t border-bord p-4">
        <a href="#/progression" className="block rounded-xl p-1 transition hover:bg-surface2" aria-label="Voir ma progression">
          <BarreXp compact />
        </a>
        <BoutonInstaller className="w-full" />
        <BoutonTheme />
        <p className="text-center text-xs text-doux">
          Créé par <strong className="font-semibold text-texte">Alioune Badara Diop</strong>
        </p>
      </div>
    </aside>
  )
}

// Barre du haut (mobile et tablette)
export function BarreHaut() {
  const { etat, niveau } = useProgression()

  return (
    <header className="sticky top-0 z-40 border-b border-bord bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur lg:hidden">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
        <a href="#/" className="flex items-center gap-2.5" aria-label="SENSqL — accueil">
          <Logo hauteur={26} />
          <span className="text-xl font-bold tracking-tight">SENSqL</span>
        </a>
        <a
          href="#/progression"
          className="ml-auto flex min-h-[36px] items-center gap-2 rounded-full bg-surface2 px-3 text-sm font-semibold"
          aria-label={`Progression : niveau ${niveau.id}, ${etat.xp} XP`}
        >
          <span aria-hidden="true">{niveau.icone}</span>
          <span className="tabular-nums">{etat.xp} XP</span>
        </a>
      </div>
    </header>
  )
}

// Barre du bas (mobile et tablette) : 4 accès directs + « Plus » qui ouvre le reste.
export function BarreBas({ cheminCourant }) {
  // Le panneau est lié à la page où on l'a ouvert : changer de page le referme sans effet.
  const [ouvertSur, setOuvertSur] = useState(null)
  const plusOuvert = ouvertSur === cheminCourant
  const setPlusOuvert = useCallback(
    (ouvert) => setOuvertSur(ouvert ? cheminCourant : null),
    [cheminCourant],
  )
  const principaux = TOUS.filter((e) => PRINCIPAUX.includes(e.chemin))
  const secondaires = TOUS.filter((e) => !PRINCIPAUX.includes(e.chemin))
  const plusActif = secondaires.some((e) => estActif(e.chemin, cheminCourant))

  useEffect(() => {
    if (!plusOuvert) return undefined
    const surTouche = (e) => e.key === 'Escape' && setPlusOuvert(false)
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [plusOuvert, setPlusOuvert])

  return (
    <>
      {plusOuvert && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fermer le menu"
            onClick={() => setPlusOuvert(false)}
          />
          <div
            role="dialog"
            aria-label="Plus d’options"
            className="absolute inset-x-0 bottom-0 animate-apparition rounded-t-3xl border-t border-bord bg-surface p-5 pb-28 shadow-leve"
          >
            <div className="mx-auto max-w-md space-y-5">
              <ul className="grid grid-cols-1 gap-2">
                {secondaires.map(({ chemin, libelle, Icone }) => (
                  <li key={chemin}>
                    <a
                      href={`#${chemin}`}
                      className="flex min-h-[52px] items-center gap-3 rounded-2xl bg-surface2 px-4 font-semibold"
                    >
                      <Icone size={20} aria-hidden="true" className="text-ok" />
                      {libelle}
                    </a>
                  </li>
                ))}
              </ul>
              <BarreXp compact />
              <BoutonTheme />
              <BoutonInstaller />
              <p className="text-center text-xs text-doux">
                Créé par <strong className="font-semibold text-texte">Alioune Badara Diop</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-bord bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Navigation principale"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {principaux.map(({ chemin, libelle, Icone }) => {
            const actif = estActif(chemin, cheminCourant)
            return (
              <li key={chemin}>
                <a
                  href={`#${chemin}`}
                  aria-current={actif ? 'page' : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                    actif ? 'text-ok' : 'text-doux'
                  }`}
                >
                  <span className={`rounded-full px-4 py-1 transition-colors ${actif ? 'bg-ok/15' : ''}`}>
                    <Icone size={20} aria-hidden="true" />
                  </span>
                  {libelle}
                </a>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => setPlusOuvert(!plusOuvert)}
              aria-expanded={plusOuvert}
              className={`flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                plusActif || plusOuvert ? 'text-ok' : 'text-doux'
              }`}
            >
              <span className={`rounded-full px-4 py-1 transition-colors ${plusActif || plusOuvert ? 'bg-ok/15' : ''}`}>
                {plusOuvert ? <X size={20} aria-hidden="true" /> : <Ellipsis size={20} aria-hidden="true" />}
              </span>
              Plus
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}
