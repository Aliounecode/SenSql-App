import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, TriangleAlert } from 'lucide-react'
import BlocSql, { ActionBloc } from '../composants/BlocSql'
import { CONCEPTS } from '../donnees/concepts'
import { useProgression } from '../hooks/useProgression'
import { lienEditeur } from '../routage'

function ListeConcepts() {
  const { etat } = useProgression()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="titre-page">Les concepts SQL</h1>
        <p className="texte-page">
          {etat.conceptsVus.length} / {CONCEPTS.length} consultés. Chaque fiche contient des exemples que vous
          pouvez exécuter dans l’éditeur.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPTS.map((concept) => (
          <a key={concept.id} href={`#/concepts/${concept.id}`} className="carte-cliquable flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <span className={`puce ${concept.couleur}`}>{concept.sigle}</span>
              {etat.conceptsVus.includes(concept.id) && (
                <span className="text-sm font-semibold text-ok" aria-label="Déjà consulté">
                  ✓ vu
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold leading-tight">{concept.nom}</h2>
            <p className="text-sm leading-relaxed text-doux">{concept.resume}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {concept.commandes.slice(0, 3).map((commande) => (
                <code key={commande} className="rounded-md bg-surface2 px-1.5 py-0.5 font-code text-[11px] text-doux">
                  {commande}
                </code>
              ))}
            </div>
          </a>
        ))}
      </div>

      <a href="#/quiz/general" className="btn-primaire">
        Quiz général <ArrowRight size={16} aria-hidden="true" />
      </a>
    </div>
  )
}

function DetailConcept({ id }) {
  const { envoyer } = useProgression()
  const position = CONCEPTS.findIndex((c) => c.id === id)
  const concept = CONCEPTS[position]

  useEffect(() => {
    if (concept) envoyer({ type: 'concept-vu', id: concept.id })
  }, [concept, envoyer])

  if (!concept) {
    return (
      <div className="carte p-6">
        <p className="font-bold">Ce concept n’existe pas.</p>
        <a href="#/concepts" className="btn-secondaire mt-4">
          Retour aux concepts
        </a>
      </div>
    )
  }

  const precedent = CONCEPTS[position - 1]
  const suivant = CONCEPTS[position + 1]

  return (
    <article className="space-y-7">
      <a href="#/concepts" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-doux hover:text-texte">
        <ArrowLeft size={16} aria-hidden="true" /> Tous les concepts
      </a>

      <header className="carte p-5 sm:p-7">
        <span className={`puce ${concept.couleur}`}>{concept.sigle}</span>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{concept.nom}</h1>
        <p className="mt-2 text-lg leading-relaxed text-doux">{concept.resume}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {concept.commandes.map((commande) => (
            <code key={commande} className="rounded-lg bg-surface2 px-2.5 py-1 font-code text-sm">
              {commande}
            </code>
          ))}
        </div>
      </header>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">Exemples</h2>
        {concept.exemples.map((exemple) => (
          <div key={exemple.titre} className="space-y-2">
            <h3 className="font-semibold">{exemple.titre}</h3>
            <BlocSql
              code={exemple.code}
              enfants={
                exemple.essayable ? (
                  <ActionBloc href={lienEditeur(exemple.code)}>
                    Essayer <ArrowRight size={12} aria-hidden="true" />
                  </ActionBloc>
                ) : (
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold text-slate-400">
                    Non exécutable ici
                  </span>
                )
              }
            />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="carte p-5">
          <h2 className="text-xl font-bold">À retenir</h2>
          <ul className="mt-3 space-y-2">
            {concept.aRetenir.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm leading-relaxed">
                <Check size={16} className="mt-0.5 shrink-0 text-ok" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 rounded-2xl border border-alerte/40 bg-alerte/10 p-5">
          <TriangleAlert size={22} className="mt-0.5 shrink-0 text-alerte" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold">Erreur fréquente</h2>
            <p className="mt-2 text-sm leading-relaxed">{concept.erreur}</p>
          </div>
        </div>
      </section>

      <nav className="flex items-center justify-between gap-3" aria-label="Concepts voisins">
        {precedent ? (
          <a href={`#/concepts/${precedent.id}`} className="btn-secondaire">
            <ArrowLeft size={16} aria-hidden="true" /> {precedent.sigle}
          </a>
        ) : (
          <span />
        )}
        {suivant ? (
          <a href={`#/concepts/${suivant.id}`} className="btn-primaire">
            {suivant.sigle} <ArrowRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <a href="#/quiz/general" className="btn-primaire">
            Quiz général <ArrowRight size={16} aria-hidden="true" />
          </a>
        )}
      </nav>
    </article>
  )
}

export default function Concepts({ segments }) {
  const id = segments[1]
  return id ? <DetailConcept id={id} /> : <ListeConcepts />
}
