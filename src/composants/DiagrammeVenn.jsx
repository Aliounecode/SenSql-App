import { useId } from 'react'

const RAYON = 70
const CENTRE_A = 110
const CENTRE_B = 190

function decrire(zones) {
  const parties = []
  if (zones.gauche) parties.push('la partie de A sans correspondance')
  if (zones.inter) parties.push('l’intersection de A et B')
  if (zones.droite) parties.push('la partie de B sans correspondance')
  return `Diagramme de Venn : ${parties.join(', ')}`
}

const TRANSITION = { transition: 'opacity 350ms ease' }

// A (bleu) et B (violet) sont les deux tables ; la zone verte est ce que la jointure renvoie.
// Les zones sont toujours dessinées et apparaissent en fondu : le diagramme peut se transformer d'une jointure à l'autre.
export default function DiagrammeVenn({ zones, className = '' }) {
  const id = useId().replaceAll(':', '')

  return (
    <svg viewBox="0 0 300 170" className={className} role="img" aria-label={decrire(zones)}>
      <defs>
        <clipPath id={`${id}-dansA`}>
          <circle cx={CENTRE_A} cy="85" r={RAYON} />
        </clipPath>
        <mask id={`${id}-sansA`}>
          <rect width="300" height="170" fill="white" />
          <circle cx={CENTRE_A} cy="85" r={RAYON} fill="black" />
        </mask>
        <mask id={`${id}-sansB`}>
          <rect width="300" height="170" fill="white" />
          <circle cx={CENTRE_B} cy="85" r={RAYON} fill="black" />
        </mask>
      </defs>

      <circle cx={CENTRE_A} cy="85" r={RAYON} className="fill-a/10" />
      <circle cx={CENTRE_B} cy="85" r={RAYON} className="fill-b/10" />

      <g className="fill-ok">
        <circle
          cx={CENTRE_A}
          cy="85"
          r={RAYON}
          mask={`url(#${id}-sansB)`}
          style={{ ...TRANSITION, opacity: zones.gauche ? 0.55 : 0 }}
        />
        <circle
          cx={CENTRE_B}
          cy="85"
          r={RAYON}
          clipPath={`url(#${id}-dansA)`}
          style={{ ...TRANSITION, opacity: zones.inter ? 0.75 : 0 }}
        />
        <circle
          cx={CENTRE_B}
          cy="85"
          r={RAYON}
          mask={`url(#${id}-sansA)`}
          style={{ ...TRANSITION, opacity: zones.droite ? 0.55 : 0 }}
        />
      </g>

      <circle cx={CENTRE_A} cy="85" r={RAYON} fill="none" className="stroke-a" strokeWidth="3" />
      <circle cx={CENTRE_B} cy="85" r={RAYON} fill="none" className="stroke-b" strokeWidth="3" />

      <text x="70" y="95" fontSize="26" fontWeight="700" className="fill-texte" fontFamily="inherit">
        A
      </text>
      <text x="218" y="95" fontSize="26" fontWeight="700" className="fill-texte" fontFamily="inherit">
        B
      </text>
    </svg>
  )
}
