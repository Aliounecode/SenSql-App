// Routage par « hash » (#/jointures, #/concepts/ddl…) : aucune configuration serveur nécessaire,
// parfait pour une PWA hébergée sur Vercel.

export function analyserHash(hash) {
  const brut = hash.startsWith('#') ? hash.slice(1) : hash
  const [chemin = '/', requete = ''] = (brut || '/').split('?')
  const cheminPropre = chemin.startsWith('/') ? chemin : `/${chemin}`
  return {
    chemin: cheminPropre,
    segments: cheminPropre.split('/').filter(Boolean),
    params: new URLSearchParams(requete),
    cle: hash,
  }
}

// Lien vers l'éditeur avec une requête pré-remplie
export function lienEditeur(requete) {
  return `#/editeur?q=${encodeURIComponent(requete)}`
}
