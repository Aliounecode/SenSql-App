import { useSyncExternalStore } from 'react'
import { analyserHash } from '../routage'

function abonner(rappel) {
  window.addEventListener('hashchange', rappel)
  return () => window.removeEventListener('hashchange', rappel)
}

function lireHash() {
  return window.location.hash
}

export function useRoute() {
  const hash = useSyncExternalStore(abonner, lireHash, () => '')
  return analyserHash(hash)
}
