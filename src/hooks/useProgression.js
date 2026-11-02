import { useContext } from 'react'
import { ProgressionContexte } from '../contexte/progressionContexte'

export function useProgression() {
  const valeur = useContext(ProgressionContexte)
  if (!valeur) {
    throw new Error('useProgression doit être utilisé dans <ProgressionFournisseur>.')
  }
  return valeur
}
