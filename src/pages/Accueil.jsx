import { ArrowRight, Check, Terminal } from 'lucide-react'
import BoutonInstaller from '../composants/BoutonInstaller'
import DemoJointures from '../composants/DemoJointures'
import { useProgression } from '../hooks/useProgression'
import { etapesParcours, prochaineEtape } from '../moteur/parcours'

export default function Accueil() {
  const { etat } = useProgression()
  const etapes = etapesParcours(etat)
  const suite = prochaineEtape(etat)

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
        <div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Ne vous trompez plus jamais de jointure.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-doux">
            Voyez ce que chaque JOIN renvoie sur de vraies tables, puis entraînez-vous avec un vrai moteur SQL.
            Tout marche hors ligne.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={suite.lien} className="btn-primaire">
              {suite.libelle} <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#/editeur" className="btn-secondaire">
              <Terminal size={16} aria-hidden="true" /> Ouvrir l’éditeur
            </a>
          </div>
          <BoutonInstaller className="mt-4 max-w-sm lg:hidden" />
        </div>
        <DemoJointures />
      </section>

      <section aria-labelledby="titre-parcours">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="titre-parcours" className="text-xl font-bold">
            Votre parcours
          </h2>
          <a href="#/progression" className="text-sm font-semibold text-a hover:underline">
            Niveaux et badges
          </a>
        </div>
        <ol className="carte mt-4 divide-y divide-bord overflow-hidden">
          {etapes.map((etape, i) => {
            const complete = etape.fait >= etape.total
            return (
              <li key={etape.id}>
                <a
                  href={etape.lien}
                  className="flex min-h-[72px] items-center gap-4 px-4 py-3 transition-colors hover:bg-surface2 sm:px-5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      complete ? 'bg-ok text-surok' : 'bg-surface2 text-doux'
                    }`}
                  >
                    {complete ? <Check size={16} aria-label="Terminé" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{etape.titre}</span>
                    <span className="block truncate text-sm text-doux">{etape.detail}</span>
                  </span>
                  <span className="w-24 shrink-0 text-right sm:w-36">
                    <span className="block text-sm font-semibold tabular-nums">
                      {etape.fait} / {etape.total}
                    </span>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-surface2">
                      <span
                        className="block h-full rounded-full bg-ok transition-all duration-700"
                        style={{ width: `${Math.min(100, (etape.fait / etape.total) * 100)}%` }}
                      />
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </section>

      <p className="text-center text-xs text-doux lg:hidden">
        Créé par <strong className="font-semibold text-texte">Alioune Badara Diop</strong> · © 2026 SENSqL
      </p>
    </div>
  )
}
