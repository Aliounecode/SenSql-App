import { useSyncExternalStore } from 'react'
import { abonner, definirPreference, lirePreference } from '../moteur/theme'

export function useTheme() {
  const preference = useSyncExternalStore(abonner, lirePreference)
  return { preference, definir: definirPreference }
}
