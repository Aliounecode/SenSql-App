import { creerBase, executer } from './baseSql'

// Compare deux jeux de résultats (valeurs uniquement : les alias de colonnes sont ignorés).
function comparerResultats(attendu, obtenu, ordonne) {
  const nbColonnesAttendu = attendu.colonnes.length
  const nbColonnesObtenu = obtenu.colonnes.length

  if (nbColonnesAttendu !== nbColonnesObtenu) {
    return {
      ok: false,
      message: `Il faut ${nbColonnesAttendu} colonne(s), votre requête en retourne ${nbColonnesObtenu}.`,
    }
  }
  if (attendu.lignes.length !== obtenu.lignes.length) {
    return {
      ok: false,
      message: `Il faut ${attendu.lignes.length} ligne(s), votre requête en retourne ${obtenu.lignes.length}.`,
    }
  }

  const versTexte = (lignes) => lignes.map((ligne) => JSON.stringify(ligne))
  let a = versTexte(attendu.lignes)
  let b = versTexte(obtenu.lignes)
  if (!ordonne) {
    a = a.toSorted()
    b = b.toSorted()
  }

  const identiques = a.every((ligne, i) => ligne === b[i])
  return identiques
    ? { ok: true }
    : {
        ok: false,
        message: ordonne
          ? 'Le nombre de lignes est bon, mais les valeurs ou leur ordre ne correspondent pas.'
          : 'Le nombre de lignes est bon, mais les valeurs ne correspondent pas.',
      }
}

const DERNIER_JEU_VIDE = { colonnes: [], lignes: [] }

function dernierJeu(execution) {
  return execution.resultats.at(-1) ?? DERNIER_JEU_VIDE
}

// Requête de contrôle exécutée APRÈS la requête de l'élève (exercices de type « modif » et « ddl »)
function requeteDeControle(exercice) {
  if (exercice.type === 'ddl') {
    return `SELECT name, "notnull", pk FROM pragma_table_info('${exercice.tableVerif}') ORDER BY cid`
  }
  return `SELECT * FROM ${exercice.tableVerif} ORDER BY 1`
}

// Vérifie la réponse d'un élève en exécutant VRAIMENT sa requête sur une base neuve,
// puis en la comparant au résultat de la solution officielle.
export function verifierExercice(SQL, exercice, requeteEleve) {
  if (!requeteEleve.trim()) {
    return { ok: false, message: 'Écrivez votre requête avant de vérifier.' }
  }

  const baseReference = creerBase(SQL)
  const baseEleve = creerBase(SQL)

  try {
    const reference = executer(baseReference, exercice.solution)
    if (!reference.ok) {
      return { ok: false, message: `Erreur interne de l'exercice : ${reference.erreur}` }
    }

    const execution = executer(baseEleve, requeteEleve)
    if (!execution.ok) {
      return { ok: false, message: `Erreur SQL : ${execution.erreur}` }
    }

    if (exercice.type === 'select') {
      if (execution.resultats.length === 0) {
        return { ok: false, message: 'Votre requête ne retourne aucun résultat. Pensez au SELECT.' }
      }
      const ordonne = /\border\s+by\b/i.test(exercice.solution)
      return comparerResultats(dernierJeu(reference), dernierJeu(execution), ordonne)
    }

    // « modif » et « ddl » : on compare l'état de la base après exécution
    const controle = requeteDeControle(exercice)
    const attendu = executer(baseReference, controle)
    const obtenu = executer(baseEleve, controle)
    if (!obtenu.ok) {
      return {
        ok: false,
        message: `L'objet « ${exercice.tableVerif} » n'existe pas encore. Vérifiez son nom.`,
      }
    }
    return comparerResultats(dernierJeu(attendu), dernierJeu(obtenu), true)
  } finally {
    baseReference.close()
    baseEleve.close()
  }
}
