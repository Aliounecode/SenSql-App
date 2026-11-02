import { use, useRef, useState } from 'react'
import { Database, History, Play, RotateCcw } from 'lucide-react'
import TableauResultat from '../composants/TableauResultat'
import { useProgression } from '../hooks/useProgression'
import { TABLES_DOC, chargerSql, creerBase, executer } from '../moteur/baseSql'

const REQUETE_PAR_DEFAUT = `SELECT c.nom, o.id AS commande
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id;`

const EXEMPLES = [
  { titre: 'Tous les clients', code: 'SELECT * FROM clients;' },
  {
    titre: 'Clients sans commande',
    code: `SELECT c.nom
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id
WHERE o.id IS NULL;`,
  },
  {
    titre: 'Anomalies (FULL JOIN)',
    code: `SELECT c.nom, o.id AS commande
FROM clients c
FULL JOIN commandes o ON c.id = o.client_id
WHERE c.id IS NULL OR o.id IS NULL;`,
  },
  {
    titre: 'CA par ville',
    code: `SELECT c.ville, SUM(o.quantite * p.prix) AS ca
FROM commandes o
JOIN clients c ON c.id = o.client_id
JOIN produits p ON p.id = o.produit_id
GROUP BY c.ville
ORDER BY ca DESC;`,
  },
  {
    titre: 'Transaction + ROLLBACK',
    code: `BEGIN;
DELETE FROM clients;
SELECT COUNT(*) AS apres_suppression FROM clients;
ROLLBACK;
SELECT COUNT(*) AS apres_rollback FROM clients;`,
  },
]

const MAX_HISTORIQUE = 8

export default function Editeur({ params }) {
  const SQL = use(chargerSql())
  const { envoyer } = useProgression()
  const [base, setBase] = useState(() => creerBase(SQL))
  const [requete, setRequete] = useState(() => params.get('q') ?? REQUETE_PAR_DEFAUT)
  const [sortie, setSortie] = useState(null)
  const [historique, setHistorique] = useState([])
  const zone = useRef(null)

  function lancer() {
    const execution = executer(base, requete)
    setSortie(execution)
    if (execution.ok) {
      envoyer({ type: 'requete-reussie' })
      setHistorique((h) => [requete, ...h.filter((r) => r !== requete)].slice(0, MAX_HISTORIQUE))
    }
  }

  function reinitialiser() {
    base.close()
    setBase(creerBase(SQL))
    setSortie(null)
  }

  // Insère du texte à l'endroit du curseur (clic sur une table ou une colonne)
  function inserer(texte) {
    const champ = zone.current
    if (!champ) return
    const debut = champ.selectionStart
    const fin = champ.selectionEnd
    const nouveau = requete.slice(0, debut) + texte + requete.slice(fin)
    setRequete(nouveau)
    requestAnimationFrame(() => {
      champ.focus()
      champ.setSelectionRange(debut + texte.length, debut + texte.length)
    })
  }

  function surTouche(evenement) {
    if ((evenement.ctrlKey || evenement.metaKey) && evenement.key === 'Enter') {
      evenement.preventDefault()
      lancer()
    } else if (evenement.key === 'Tab' && !evenement.shiftKey) {
      // Tab écrit deux espaces au lieu de quitter le champ (Échap puis Tab pour en sortir)
      evenement.preventDefault()
      inserer('  ')
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="titre-page">Éditeur SQL</h1>
        <p className="texte-page">
          Un vrai moteur SQLite tourne dans votre navigateur. Modifiez les données, créez des vues, des index, des
          triggers : « Réinitialiser » remet la base à zéro.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0d1220] shadow-carte">
            <label htmlFor="requete" className="sr-only">
              Votre requête SQL
            </label>
            <textarea
              id="requete"
              ref={zone}
              value={requete}
              onChange={(e) => setRequete(e.target.value)}
              onKeyDown={surTouche}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              rows={9}
              className="block w-full resize-y bg-transparent p-4 font-code text-sm leading-relaxed text-slate-100 caret-emerald-300 outline-none placeholder:text-slate-600"
              placeholder="Écrivez votre requête SQL ici…"
            />
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-2.5">
              <button type="button" className="btn-primaire" onClick={lancer}>
                <Play size={16} aria-hidden="true" /> Exécuter
              </button>
              <button
                type="button"
                className="btn border border-white/15 text-slate-200 hover:bg-white/10"
                onClick={reinitialiser}
              >
                <RotateCcw size={16} aria-hidden="true" /> Réinitialiser
              </button>
              <span className="ml-auto hidden text-xs text-slate-500 sm:inline">Ctrl / ⌘ + Entrée pour exécuter</span>
            </div>
          </div>

          <div aria-live="polite" className="space-y-4">
            {sortie && !sortie.ok && (
              <div role="alert" className="rounded-2xl border border-erreur/40 bg-erreur/10 p-4">
                <p className="text-sm font-bold text-erreur">Erreur SQL</p>
                <p className="mt-1 break-words font-code text-sm">{sortie.erreur}</p>
              </div>
            )}

            {sortie?.ok && sortie.resultats.length === 0 && (
              <div className="rounded-2xl border border-ok/40 bg-ok/10 p-4 text-sm font-semibold text-ok">
                Instruction exécutée en {sortie.duree} ms
                {sortie.modifiees > 0 && ` · ${sortie.modifiees} ligne(s) modifiée(s)`}.
              </div>
            )}

            {sortie?.ok &&
              sortie.resultats.map((jeu, i) => (
                <TableauResultat
                  key={i}
                  titre={`Résultat ${sortie.resultats.length > 1 ? i + 1 : ''} · ${sortie.duree} ms`.trim()}
                  colonnes={jeu.colonnes}
                  lignes={jeu.lignes}
                />
              ))}
          </div>

          {historique.length > 0 && (
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-doux">
                <History size={14} aria-hidden="true" /> Requêtes réussies de cette session
              </h2>
              <ul className="space-y-1.5">
                {historique.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => setRequete(r)}
                      className="w-full truncate rounded-xl border border-bord bg-surface px-3 py-2 text-left font-code text-xs transition hover:border-a/60"
                      title="Remettre cette requête dans l’éditeur"
                    >
                      {r.replace(/\s+/g, ' ')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="rounded-xl bg-surface2 p-3 text-xs leading-relaxed text-doux">
            Moteur : SQLite. Les commandes propres à MySQL/PostgreSQL (<code>GRANT</code>, <code>REVOKE</code>,{' '}
            <code>CREATE PROCEDURE</code>, <code>CREATE FUNCTION</code>) n’existent pas ici ; le reste (DDL, DML,
            transactions, vues, index, triggers, jointures y compris <code>FULL</code>) fonctionne.
          </p>
        </section>

        <aside className="space-y-5">
          <div className="carte p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Database size={16} aria-hidden="true" /> Tables
            </h2>
            <p className="mt-1 text-xs text-doux">Touchez un nom pour l’insérer dans la requête.</p>
            <ul className="mt-3 space-y-3">
              {TABLES_DOC.map((table) => (
                <li key={table.nom}>
                  <button
                    type="button"
                    onClick={() => inserer(table.nom)}
                    className="font-code text-sm font-bold text-a hover:underline"
                  >
                    {table.nom}
                  </button>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {table.colonnes.map((colonne) => (
                      <button
                        key={colonne}
                        type="button"
                        onClick={() => inserer(colonne)}
                        className="rounded-md bg-surface2 px-1.5 py-0.5 font-code text-[11px] text-doux transition hover:bg-a/15 hover:text-a"
                      >
                        {colonne}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="carte p-4">
            <h2 className="text-sm font-bold">Exemples</h2>
            <ul className="mt-2 space-y-0.5">
              {EXEMPLES.map((exemple) => (
                <li key={exemple.titre}>
                  <button
                    type="button"
                    onClick={() => setRequete(exemple.code)}
                    className="min-h-[40px] w-full rounded-lg px-2.5 text-left text-sm font-medium transition hover:bg-surface2"
                  >
                    {exemple.titre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
