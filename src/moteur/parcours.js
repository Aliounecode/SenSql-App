import { CONCEPTS } from '../donnees/concepts'
import { EXERCICES } from '../donnees/exercices'
import { JOINTURES } from '../donnees/jointures'
import { QUESTIONS_GENERAL, QUESTIONS_JOINTURES } from '../donnees/quiz'

// Les quatre étapes du parcours, avec l'avancement de l'apprenant.
export function etapesParcours(etat) {
  return [
    {
      id: 'jointures',
      titre: 'Les 7 jointures',
      detail: 'Diagramme, requête et résultat réel',
      lien: '#/jointures',
      fait: etat.jointuresVues.length,
      total: JOINTURES.length,
    },
    {
      id: 'concepts',
      titre: 'Les concepts SQL',
      detail: 'DDL, DML, DCL, TCL, vues, index, triggers…',
      lien: '#/concepts',
      fait: etat.conceptsVus.length,
      total: CONCEPTS.length,
    },
    {
      id: 'exercices',
      titre: 'Les exercices',
      detail: 'Corrigés automatiquement',
      lien: '#/exercices',
      fait: etat.exercicesReussis.length,
      total: EXERCICES.length,
    },
    {
      id: 'quiz',
      titre: 'Les quiz',
      detail: 'Jointures et culture générale SQL',
      lien: '#/quiz',
      fait: etat.meilleursQuiz.jointures + etat.meilleursQuiz.general,
      total: QUESTIONS_JOINTURES.length + QUESTIONS_GENERAL.length,
    },
  ]
}

// Ce que l'apprenant devrait faire maintenant.
export function prochaineEtape(etat) {
  const debut = etat.xp === 0
  if (etat.jointuresVues.length < JOINTURES.length) {
    return {
      libelle: debut ? 'Commencer par les jointures' : 'Continuer les jointures',
      lien: '#/jointures',
    }
  }
  const concept = CONCEPTS.find((c) => !etat.conceptsVus.includes(c.id))
  if (concept) return { libelle: `Lire : ${concept.nom}`, lien: `#/concepts/${concept.id}` }
  if (etat.exercicesReussis.length < EXERCICES.length) {
    return { libelle: 'Reprendre les exercices', lien: '#/exercices' }
  }
  if (
    etat.meilleursQuiz.jointures < QUESTIONS_JOINTURES.length ||
    etat.meilleursQuiz.general < QUESTIONS_GENERAL.length
  ) {
    return { libelle: 'Viser le sans-faute aux quiz', lien: '#/quiz' }
  }
  return { libelle: 'Pratiquer dans l’éditeur', lien: '#/editeur' }
}
