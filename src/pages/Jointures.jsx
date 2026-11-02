import { use, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Lightbulb, TriangleAlert } from 'lucide-react'
import BlocSql, { ActionBloc } from '../composants/BlocSql'
import DiagrammeVenn from '../composants/DiagrammeVenn'
import TableauResultat from '../composants/TableauResultat'
import { A_RETENIR, JOINTURES } from '../donnees/jointures'
import { useProgression } from '../hooks/useProgression'
import { chargerSql, creerBase, executer } from '../moteur/baseSql'
import { lienEditeur } from '../routage'

// Pour chaque ligne des tables sources : est-elle renvoyée par la jointure choisie ?
function lignesRetenues(clients, commandes, zones) {
  const idClients = new Set(clients.lignes.map((l) => l[clients.colonnes.indexOf('id')]))
  const posClient = commandes.colonnes.indexOf('client_id')
  const clientsCommandes = new Set(commandes.lignes.map((l) => l[posClient]))
  const posId = clients.colonnes.indexOf('id')

  return {
    clients: clients.lignes.map((l) => (clientsCommandes.has(l[posId]) ? zones.inter : zones.gauche)),
    commandes: commandes.lignes.map((l) => (idClients.has(l[posClient]) ? zones.inter : zones.droite)),
  }
}

export default function Jointures({ segments }) {
  const SQL = use(chargerSql())
  const { envoyer } = useProgression()
  const [idCourant, setIdCourant] = useState(() =>
    JOINTURES.some((j) => j.id === segments[1]) ? segments[1] : 'left',
  )
  const [base] = useState(() => creerBase(SQL))

  const position = JOINTURES.findIndex((j) => j.id === idCourant)
  const jointure = JOINTURES[position]

  function choisir(id) {
    setIdCourant(id)
    // Lien partageable (#/jointures/left) sans recharger la page ni polluer l'historique
    window.history.replaceState(null, '', `#/jointures/${id}`)
  }

  // Flèches du clavier pour passer d'une jointure à l'autre
  useEffect(() => {
    const surTouche = (e) => {
      if (e.target.closest?.('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return
      const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
      if (!delta) return
      const suivant = JOINTURES[(position + delta + JOINTURES.length) % JOINTURES.length]
      choisir(suivant.id)
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  })

  // Compte la jointure comme « consultée » (badge Explorateur)
  useEffect(() => {
    envoyer({ type: 'jointure-vue', id: idCourant })
  }, [idCourant, envoyer])

  const tables = useMemo(() => {
    const lire = (requete) => executer(base, requete).resultats[0]
    return { clients: lire('SELECT * FROM clients'), commandes: lire('SELECT * FROM commandes') }
  }, [base])

  const resultat = useMemo(() => {
    const execution = executer(base, jointure.sqlExemple)
    return execution.ok ? execution.resultats[0] : null
  }, [base, jointure])

  const retenues = useMemo(
    () => lignesRetenues(tables.clients, tables.commandes, jointure.zones),
    [tables, jointure],
  )

  return (
    <div className="space-y-8">
      <header>
        <h1 className="titre-page">Les jointures</h1>
        <p className="texte-page">
          Choisissez une jointure. <strong className="text-a">A = clients</strong> et{' '}
          <strong className="text-b">B = commandes</strong> : dans les tables, les lignes en vert sont celles que la
          jointure renvoie.
        </p>
      </header>

      <div className="sticky top-14 z-30 -mx-4 border-b border-bord bg-fond/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="overflow-x-auto" role="tablist" aria-label="Types de jointures">
          <div className="flex w-max gap-1.5">
            {JOINTURES.map((j) => (
              <button
                key={j.id}
                type="button"
                role="tab"
                aria-selected={j.id === idCourant}
                onClick={() => choisir(j.id)}
                className={`min-h-[40px] whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold transition-colors ${
                  j.id === idCourant ? 'bg-texte text-fond' : 'bg-surface text-doux hover:bg-surface2 hover:text-texte'
                }`}
              >
                {j.court}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1.5 hidden text-xs text-doux sm:block">Astuce : flèches ← → du clavier.</p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="carte p-5 sm:p-6">
          <DiagrammeVenn zones={jointure.zones} className="mx-auto h-auto w-full max-w-sm" />
          <h2 className="mt-4 font-code text-lg font-bold">{jointure.nom}</h2>
          <p className="mt-1 leading-relaxed text-doux">{jointure.resume}</p>
          <p className="mt-4 rounded-xl bg-ok/10 p-3.5 text-lg font-semibold leading-snug text-ok">
            {jointure.enFrancais}
          </p>
        </div>

        <div className="space-y-5">
          <BlocSql titre="Forme générale" code={jointure.sqlGenerique} />
          <BlocSql
            titre="Sur nos tables"
            code={jointure.sqlExemple}
            enfants={
              <ActionBloc href={lienEditeur(jointure.sqlExemple)}>
                Essayer <ArrowRight size={12} aria-hidden="true" />
              </ActionBloc>
            }
          />
          <div className="flex gap-3 rounded-2xl border border-alerte/40 bg-alerte/10 p-4">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-alerte" aria-hidden="true" />
            <p className="text-sm leading-relaxed">
              <strong>Piège : </strong>
              {jointure.piege}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Ce que la jointure renvoie</h2>
        {resultat ? (
          <TableauResultat titre="Résultat" colonnes={resultat.colonnes} lignes={resultat.lignes} teinte="text-ok" />
        ) : (
          <p className="carte p-4 text-sm">Cette requête n’a pas pu être exécutée.</p>
        )}
        <p className="text-sm text-doux">
          Un <span className="rounded bg-erreur/10 px-1 font-semibold italic text-erreur">NULL</span> signifie qu’aucune
          ligne ne correspond de ce côté.
        </p>

        <h3 className="pt-2 text-lg font-bold">Les tables de départ</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TableauResultat
            titre="A : clients"
            teinte="text-a"
            colonnes={tables.clients.colonnes}
            lignes={tables.clients.lignes}
            retenues={retenues.clients}
          />
          <TableauResultat
            titre="B : commandes"
            teinte="text-b"
            colonnes={tables.commandes.colonnes}
            lignes={tables.commandes.lignes}
            retenues={retenues.commandes}
          />
        </div>
        <p className="text-sm text-doux">
          Dans cette base : Fatou et Awa n’ont jamais commandé, la commande 6 vise un client inexistant (99) et la
          commande 7 n’a pas de client.
        </p>
      </section>

      <section className="carte p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Lightbulb size={20} className="text-alerte" aria-hidden="true" /> À retenir
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {A_RETENIR.map(({ cle, texte }) => (
            <li key={cle} className="flex items-start gap-3 text-sm">
              <span className="puce shrink-0 bg-ok/15 text-ok">{cle}</span>
              <span className="leading-relaxed">{texte}</span>
            </li>
          ))}
        </ul>
        <a href="#/quiz/jointures" className="btn-primaire mt-5">
          Tester mes connaissances <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
    </div>
  )
}
