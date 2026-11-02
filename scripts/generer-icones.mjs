// Génère le logo SENSqL (SVG) et toutes les icônes PNG de la PWA.
// Utilisation : npm run icones   (nécessite le paquet « sharp », déjà en devDependencies)
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const racine = join(dirname(fileURLToPath(import.meta.url)), '..')
const dossierIcones = join(racine, 'public', 'icons')

const COULEURS = {
  fondHaut: '#131a30',
  fondBas: '#070a14',
  bleu: '#3b82f6',
  violet: '#8b5cf6',
  vert: '#34d399',
}

// Le logo : deux tables (bleu, violet) qui se chevauchent — ce que la jointure renvoie est en vert.
function marque({ echelle = 1 } = {}) {
  const rayon = 118
  const gauche = 196
  const droite = 316
  return `
  <g transform="translate(256 256) scale(${echelle}) translate(-256 -256)">
    <defs>
      <clipPath id="dansGauche"><circle cx="${gauche}" cy="256" r="${rayon}"/></clipPath>
    </defs>
    <circle cx="${gauche}" cy="256" r="${rayon}" fill="${COULEURS.bleu}"/>
    <circle cx="${droite}" cy="256" r="${rayon}" fill="${COULEURS.violet}"/>
    <circle cx="${droite}" cy="256" r="${rayon}" fill="${COULEURS.vert}" clip-path="url(#dansGauche)"/>
  </g>`
}

function svgIcone({ plein, echelle }) {
  const defs = `<defs><linearGradient id="fond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COULEURS.fondHaut}"/><stop offset="1" stop-color="${COULEURS.fondBas}"/></linearGradient></defs>`
  const fond = plein
    ? `<rect width="512" height="512" fill="url(#fond)"/>`
    : `<rect width="512" height="512" rx="112" fill="url(#fond)"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${defs}${fond}${marque({ echelle })}</svg>`
}

await mkdir(dossierIcones, { recursive: true })

const variantes = [
  // Icônes « any » : coins arrondis, le logo occupe bien l'espace
  { fichier: 'icon-192.png', taille: 192, svg: svgIcone({ plein: false, echelle: 1 }) },
  { fichier: 'icon-512.png', taille: 512, svg: svgIcone({ plein: false, echelle: 1 }) },
  // Icône « maskable » : plein cadre + logo réduit pour rester dans la zone de sécurité (80 %)
  { fichier: 'icon-maskable-512.png', taille: 512, svg: svgIcone({ plein: true, echelle: 0.78 }) },
  // iOS applique son propre masque : plein cadre, sans transparence
  { fichier: 'apple-touch-icon.png', taille: 180, svg: svgIcone({ plein: true, echelle: 0.85 }) },
]

for (const { fichier, taille, svg } of variantes) {
  await sharp(Buffer.from(svg)).resize(taille, taille).png().toFile(join(dossierIcones, fichier))
  console.log('✔', fichier)
}

// Favicon vectoriel (navigateurs) + logo source
const svgFavicon = svgIcone({ plein: false, echelle: 1 })
await writeFile(join(racine, 'public', 'favicon.svg'), svgFavicon)
await writeFile(join(dossierIcones, 'logo.svg'), svgFavicon)
console.log('✔ favicon.svg + icons/logo.svg')
