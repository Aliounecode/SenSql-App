const LIMITE_LIGNES = 200

function Cellule({ valeur }) {
  if (valeur === null) {
    return <span className="rounded bg-erreur/10 px-1 font-semibold italic text-erreur">NULL</span>
  }
  return <span>{String(valeur)}</span>
}

// Affiche un jeu de résultats SQL. Les NULL sont mis en évidence (essentiel pour comprendre les jointures).
// `retenues` (optionnel) : un booléen par ligne — les lignes renvoyées par la jointure sont surlignées en vert.
export default function TableauResultat({ colonnes, lignes, titre, retenues = null, teinte = 'text-texte' }) {
  const visibles = lignes.slice(0, LIMITE_LIGNES)

  return (
    <div className="overflow-hidden rounded-2xl border border-bord bg-surface">
      {titre && (
        <div className="flex items-center justify-between gap-3 border-b border-bord bg-surface2 px-3.5 py-2">
          <span className={`font-code text-xs font-semibold ${teinte}`}>{titre}</span>
          <span className="text-xs text-doux">
            {lignes.length} ligne{lignes.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-code text-xs sm:text-sm">
          <thead>
            <tr className="text-doux">
              {colonnes.map((colonne, i) => (
                <th key={`${colonne}-${i}`} className="whitespace-nowrap border-b border-bord px-3.5 py-2 font-semibold">
                  {colonne}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((ligne, i) => {
              const retenue = retenues ? retenues[i] : null
              return (
                <tr
                  key={i}
                  className={`border-b border-bord/70 transition-colors last:border-0 ${
                    retenue === true ? 'bg-ok/15' : retenue === false ? 'opacity-45' : ''
                  }`}
                >
                  {ligne.map((valeur, j) => (
                    <td
                      key={j}
                      className={`whitespace-nowrap px-3.5 py-1.5 ${
                        j === 0 && retenue === true ? 'border-l-2 border-ok' : j === 0 && retenues ? 'border-l-2 border-transparent' : ''
                      }`}
                    >
                      <Cellule valeur={valeur} />
                    </td>
                  ))}
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={Math.max(colonnes.length, 1)} className="px-3.5 py-5 text-center text-doux">
                  Aucune ligne
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {lignes.length > LIMITE_LIGNES && (
        <p className="border-t border-bord px-3.5 py-2 text-xs text-doux">
          Affichage limité aux {LIMITE_LIGNES} premières lignes.
        </p>
      )}
    </div>
  )
}
