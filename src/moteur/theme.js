// Thème clair / sombre / automatique (suit le système). Mémorisé dans localStorage.
const CLE = 'sensql:theme'
const COULEURS_BARRE = { clair: '#f6f7fb', sombre: '#0a0e1a' }
const ecouteurs = new Set()

function lire() {
  try {
    const valeur = localStorage.getItem(CLE)
    return valeur === 'clair' || valeur === 'sombre' ? valeur : 'auto'
  } catch {
    return 'auto'
  }
}

let preference = lire()

function systemeSombre() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function appliquerTheme() {
  const sombre = preference === 'sombre' || (preference === 'auto' && systemeSombre())
  document.documentElement.classList.toggle('dark', sombre)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', sombre ? COULEURS_BARRE.sombre : COULEURS_BARRE.clair)
}

export function initialiserTheme() {
  appliquerTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', appliquerTheme)
}

export function lirePreference() {
  return preference
}

export function definirPreference(valeur) {
  preference = valeur
  try {
    if (valeur === 'auto') localStorage.removeItem(CLE)
    else localStorage.setItem(CLE, valeur)
  } catch {
    // Stockage indisponible : le thème vaut pour cette session seulement.
  }
  appliquerTheme()
  ecouteurs.forEach((ecouteur) => ecouteur())
}

export function abonner(ecouteur) {
  ecouteurs.add(ecouteur)
  return () => ecouteurs.delete(ecouteur)
}
