// Écran de chargement : des blocs qui scintillent, à la forme d'une page, plutôt qu'un cercle qui tourne.
export default function Chargement({ message = 'Chargement…' }) {
  return (
    <div role="status" aria-live="polite" className="space-y-5">
      <div className="squelette h-9 w-2/3 max-w-sm" />
      <div className="squelette h-4 w-full max-w-xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="squelette h-56" />
        <div className="squelette h-56" />
      </div>
      <p className="text-sm text-doux">{message}</p>
    </div>
  )
}
