import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const MOTS_CLES = new Set(
  (
    'SELECT FROM WHERE INNER LEFT RIGHT FULL OUTER JOIN ON AS AND OR NOT NULL IS IN LIKE ORDER BY GROUP HAVING ' +
    'LIMIT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW INDEX UNIQUE ALTER ADD COLUMN DROP TRUNCATE ' +
    'PRIMARY KEY DEFAULT BEGIN COMMIT ROLLBACK SAVEPOINT TO TRIGGER BEFORE AFTER FOR EACH ROW END DESC ASC ' +
    'COUNT SUM AVG MIN MAX ROUND UPPER LENGTH SUBSTR CASE WHEN THEN ELSE EXPLAIN QUERY PLAN GRANT REVOKE CALL ' +
    'PROCEDURE FUNCTION RETURNS RETURN IF DECLARE DISTINCT UNION ALL INTEGER TEXT VARCHAR INT DECIMAL ' +
    'RAISE ABORT CURRENT_TIMESTAMP ROLE PRIVILEGES SCHEMA TABLES OUT DETERMINISTIC'
  ).split(' '),
)

// Découpe le code en commentaires, chaînes, mots et nombres, puis colore chaque morceau.
const MOTIF = /(--[^\n]*|'(?:[^']|'')*'|\b[A-Za-z_][A-Za-z_0-9]*\b|\b\d+\b)/g

function colorerSql(code) {
  return code.split(MOTIF).map((morceau, i) => {
    if (!morceau) return null
    if (morceau.startsWith('--')) {
      return (
        <span key={i} className="italic text-slate-500">
          {morceau}
        </span>
      )
    }
    if (morceau.startsWith("'")) {
      return (
        <span key={i} className="text-amber-300">
          {morceau}
        </span>
      )
    }
    if (/^\d+$/.test(morceau)) {
      return (
        <span key={i} className="text-violet-300">
          {morceau}
        </span>
      )
    }
    if (MOTS_CLES.has(morceau.toUpperCase())) {
      return (
        <span key={i} className="font-semibold text-sky-300">
          {morceau}
        </span>
      )
    }
    return morceau
  })
}

// Le code reste sombre dans les deux thèmes : lisible partout, comme un vrai éditeur.
export default function BlocSql({ code, titre, enfants = null, copiable = true }) {
  const [copie, setCopie] = useState(false)

  async function copier() {
    try {
      await navigator.clipboard.writeText(code)
      setCopie(true)
      setTimeout(() => setCopie(false), 1600)
    } catch {
      // Presse-papiers indisponible : on ne fait rien.
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0d1220] shadow-carte">
      <div className="flex min-h-[44px] items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
        <span className="truncate font-code text-xs text-slate-400">{titre ?? 'SQL'}</span>
        <div className="flex items-center gap-1">
          {enfants}
          {copiable && (
            <button
              type="button"
              onClick={copier}
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
              aria-label="Copier le code"
            >
              {copie ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              {copie ? 'Copié' : 'Copier'}
            </button>
          )}
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-code text-[13px] leading-relaxed text-slate-100 sm:text-sm">
        <code>{colorerSql(code)}</code>
      </pre>
    </div>
  )
}

// Petit bouton d'action à placer dans l'en-tête d'un BlocSql
export function ActionBloc({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-lg bg-emerald-400 px-2.5 text-xs font-semibold text-emerald-950 transition hover:brightness-110"
    >
      {children}
    </a>
  )
}
