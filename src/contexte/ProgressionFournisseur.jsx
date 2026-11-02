import { useEffect, useMemo, useReducer } from 'react'
import { ProgressionContexte } from './progressionContexte'
import { CLE_STOCKAGE, calculerNiveau, chargerEtat, reduire } from '../moteur/progression'

// Fournit l'état de progression à toute l'appli et le sauvegarde dans le localStorage.
export default function ProgressionFournisseur({ children }) {
  const [etat, envoyer] = useReducer(reduire, undefined, chargerEtat)

  useEffect(() => {
    try {
      const { notifications, ...aSauvegarder } = etat
      void notifications
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(aSauvegarder))
    } catch {
      // Stockage indisponible (navigation privée, quota) : la progression reste en mémoire.
    }
  }, [etat])

  const valeur = useMemo(
    () => ({ etat, niveau: calculerNiveau(etat.xp), envoyer }),
    [etat],
  )

  return <ProgressionContexte value={valeur}>{children}</ProgressionContexte>
}
