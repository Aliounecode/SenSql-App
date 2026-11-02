import { useId } from 'react'

// Logo SENSqL : deux tables (bleu, violet) et ce que la jointure renvoie (vert).
export default function Logo({ hauteur = 32, className = '' }) {
  const id = useId().replaceAll(':', '')
  return (
    <svg
      viewBox="64 124 384 264"
      height={hauteur}
      width={(hauteur * 384) / 264}
      className={className}
      role="img"
      aria-label="Logo SENSqL"
    >
      <defs>
        <clipPath id={`${id}-gauche`}>
          <circle cx="196" cy="256" r="118" />
        </clipPath>
      </defs>
      <circle cx="196" cy="256" r="118" fill="#3b82f6" />
      <circle cx="316" cy="256" r="118" fill="#8b5cf6" />
      <circle cx="316" cy="256" r="118" fill="#34d399" clipPath={`url(#${id}-gauche)`} />
    </svg>
  )
}
