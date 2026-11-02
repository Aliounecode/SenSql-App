// Logique pure de la progression (niveaux, XP, badges). Aucune dépendance à React.

export const CLE_STOCKAGE = 'sensql:progression:v2'

export const NIVEAUX = [
  { id: 1, nom: 'Débutant', icone: '🌱', xpRequis: 0, description: 'Vous découvrez SQL.' },
  { id: 2, nom: 'Apprenti', icone: '📚', xpRequis: 80, description: 'Les bases sont posées.' },
  { id: 3, nom: 'Intermédiaire', icone: '⭐', xpRequis: 200, description: 'Les jointures n’ont plus de secret.' },
  { id: 4, nom: 'Avancé', icone: '💎', xpRequis: 350, description: 'Vous maîtrisez les concepts avancés.' },
  { id: 5, nom: 'Expert SQL', icone: '🏆', xpRequis: 550, description: 'Un vrai maître des bases de données.' },
]

export const BADGES = [
  { id: 'premier-pas', nom: 'Premier pas', icone: '👣', condition: 'Réussir un exercice' },
  { id: 'premiere-requete', nom: 'Première requête', icone: '⚡', condition: 'Exécuter une requête dans l’éditeur' },
  { id: 'explorateur', nom: 'Explorateur', icone: '🧭', condition: 'Consulter les 7 jointures' },
  { id: 'erudit', nom: 'Érudit', icone: '🎓', condition: 'Consulter les 9 concepts' },
  { id: 'praticien', nom: 'Praticien', icone: '💪', condition: 'Réussir 5 exercices' },
  { id: 'maitre-jointures', nom: 'Maître des jointures', icone: '🔗', condition: '100 % au quiz des jointures' },
  { id: 'sans-faute', nom: 'Sans faute', icone: '💯', condition: '100 % au quiz général' },
  { id: 'expert', nom: 'Expert SQL', icone: '🏆', condition: 'Atteindre le niveau 5' },
]

export const XP = {
  conceptVu: 5,
  jointureVue: 5,
  bonneReponseQuiz: 10,
}

export function etatInitial() {
  return {
    xp: 0,
    exercicesReussis: [],
    conceptsVus: [],
    jointuresVues: [],
    meilleursQuiz: { jointures: 0, general: 0 },
    quizParfaits: { jointures: false, general: false },
    premiereRequete: false,
    badges: [],
    notifications: [],
    prochainId: 1,
  }
}

export function calculerNiveau(xp) {
  return NIVEAUX.findLast((niveau) => xp >= niveau.xpRequis) ?? NIVEAUX[0]
}

function calculerBadges(etat) {
  const obtenus = []
  if (etat.exercicesReussis.length >= 1) obtenus.push('premier-pas')
  if (etat.premiereRequete) obtenus.push('premiere-requete')
  if (etat.jointuresVues.length >= 7) obtenus.push('explorateur')
  if (etat.conceptsVus.length >= 9) obtenus.push('erudit')
  if (etat.exercicesReussis.length >= 5) obtenus.push('praticien')
  if (etat.quizParfaits.jointures) obtenus.push('maitre-jointures')
  if (etat.quizParfaits.general) obtenus.push('sans-faute')
  if (calculerNiveau(etat.xp).id >= 5) obtenus.push('expert')
  return obtenus
}

// Après chaque action : détecte les nouveaux badges / changements de niveau et crée les notifications.
function avecRecompenses(avant, apres) {
  let { prochainId } = apres
  const notifications = [...apres.notifications]

  const niveauAvant = calculerNiveau(avant.xp)
  const niveauApres = calculerNiveau(apres.xp)
  if (niveauApres.id > niveauAvant.id) {
    notifications.push({
      id: prochainId++,
      icone: niveauApres.icone,
      titre: `Niveau ${niveauApres.id} atteint !`,
      texte: niveauApres.nom,
    })
  }

  const badges = calculerBadges(apres)
  for (const idBadge of badges) {
    if (!avant.badges.includes(idBadge)) {
      const badge = BADGES.find((b) => b.id === idBadge)
      notifications.push({
        id: prochainId++,
        icone: badge.icone,
        titre: 'Badge débloqué',
        texte: badge.nom,
      })
    }
  }

  return { ...apres, badges, notifications, prochainId }
}

function ajouterUnique(liste, valeur) {
  return liste.includes(valeur) ? liste : [...liste, valeur]
}

export function reduire(etat, action) {
  switch (action.type) {
    case 'exercice-reussi': {
      if (etat.exercicesReussis.includes(action.id)) return etat
      return avecRecompenses(etat, {
        ...etat,
        xp: etat.xp + action.xp,
        exercicesReussis: [...etat.exercicesReussis, action.id],
      })
    }
    case 'quiz-termine': {
      const precedent = etat.meilleursQuiz[action.quiz]
      const gain = Math.max(0, action.score - precedent) * XP.bonneReponseQuiz
      return avecRecompenses(etat, {
        ...etat,
        xp: etat.xp + gain,
        meilleursQuiz: { ...etat.meilleursQuiz, [action.quiz]: Math.max(precedent, action.score) },
        quizParfaits: {
          ...etat.quizParfaits,
          [action.quiz]: etat.quizParfaits[action.quiz] || action.score === action.total,
        },
      })
    }
    case 'concept-vu': {
      if (etat.conceptsVus.includes(action.id)) return etat
      return avecRecompenses(etat, {
        ...etat,
        xp: etat.xp + XP.conceptVu,
        conceptsVus: ajouterUnique(etat.conceptsVus, action.id),
      })
    }
    case 'jointure-vue': {
      if (etat.jointuresVues.includes(action.id)) return etat
      return avecRecompenses(etat, {
        ...etat,
        xp: etat.xp + XP.jointureVue,
        jointuresVues: ajouterUnique(etat.jointuresVues, action.id),
      })
    }
    case 'requete-reussie': {
      if (etat.premiereRequete) return etat
      return avecRecompenses(etat, { ...etat, premiereRequete: true })
    }
    case 'notification-fermee':
      return { ...etat, notifications: etat.notifications.filter((n) => n.id !== action.id) }
    case 'reinitialiser':
      return etatInitial()
    default:
      return etat
  }
}

// Lecture sécurisée du localStorage (données absentes, corrompues ou stockage bloqué)
export function chargerEtat() {
  const base = etatInitial()
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    if (!brut) return base
    const lu = JSON.parse(brut)
    return {
      ...base,
      ...lu,
      meilleursQuiz: { ...base.meilleursQuiz, ...lu.meilleursQuiz },
      quizParfaits: { ...base.quizParfaits, ...lu.quizParfaits },
      notifications: [],
    }
  } catch {
    return base
  }
}

// Avancement vers le niveau suivant : { niveau, suivant, pourcentage, restant }
export function avancementNiveau(xp) {
  const niveau = calculerNiveau(xp)
  const suivant = NIVEAUX.find((n) => n.id === niveau.id + 1) ?? null
  const pourcentage = suivant
    ? Math.min(100, ((xp - niveau.xpRequis) / (suivant.xpRequis - niveau.xpRequis)) * 100)
    : 100
  return { niveau, suivant, pourcentage, restant: suivant ? suivant.xpRequis - xp : 0 }
}
