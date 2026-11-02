import { Component } from 'react'
import { WifiOff } from 'lucide-react'

// Filet de sécurité : si le moteur SQL ne se charge pas (ex. première visite hors ligne),
// on affiche un message clair plutôt qu'une page blanche.
export default class ErreurBoundary extends Component {
  state = { erreur: null }

  static getDerivedStateFromError(erreur) {
    return { erreur }
  }

  render() {
    if (!this.state.erreur) return this.props.children

    return (
      <div className="carte mx-auto my-10 max-w-lg p-7 text-center">
        <WifiOff size={32} className="mx-auto text-alerte" aria-hidden="true" />
        <h2 className="mt-3 text-xl font-bold">Cette page n’a pas pu se charger</h2>
        <p className="mt-2 text-sm leading-relaxed text-doux">
          Le moteur SQL n’a pas démarré. Si vous êtes hors ligne pour la première fois, connectez-vous une fois à
          Internet : l’appli fonctionnera ensuite sans connexion.
        </p>
        <button type="button" className="btn-primaire mt-5" onClick={() => window.location.reload()}>
          Recharger la page
        </button>
      </div>
    )
  }
}
