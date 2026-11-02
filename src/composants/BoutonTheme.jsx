import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const CHOIX = [
  { valeur: 'clair', libelle: 'Clair', Icone: Sun },
  { valeur: 'sombre', libelle: 'Sombre', Icone: Moon },
  { valeur: 'auto', libelle: 'Auto', Icone: Monitor },
]

// Sélecteur à trois positions : clair, sombre, automatique (suit le système).
export default function BoutonTheme() {
  const { preference, definir } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface2 p-1" role="radiogroup" aria-label="Thème">
      {CHOIX.map(({ valeur, libelle, Icone }) => (
        <button
          key={valeur}
          type="button"
          role="radio"
          aria-checked={preference === valeur}
          onClick={() => definir(valeur)}
          className={`flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition ${
            preference === valeur ? 'bg-surface text-texte shadow-carte' : 'text-doux hover:text-texte'
          }`}
        >
          <Icone size={14} aria-hidden="true" />
          {libelle}
        </button>
      ))}
    </div>
  )
}
