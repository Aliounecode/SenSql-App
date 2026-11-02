// Quiz : chaque question a une `explication` affichée après la réponse.

import { JOINTURES } from './jointures'

// Question « quelle jointure ? » : les options sont les noms des jointures proposées
function questionJointure(question, bonneId, idsProposes, explication) {
  const options = idsProposes.map((id) => JOINTURES.find((j) => j.id === id).nom)
  return {
    categorie: 'Jointures',
    question,
    options,
    reponse: idsProposes.indexOf(bonneId),
    explication,
    jointureId: bonneId,
  }
}

export const QUESTIONS_JOINTURES = [
  questionJointure(
    'Je veux les clients qui ont passé au moins une commande, avec leurs commandes.',
    'inner',
    ['left', 'inner', 'full', 'right'],
    'Seules les lignes qui ont une correspondance des deux côtés nous intéressent : c’est l’intersection.',
  ),
  questionJointure(
    'Je veux TOUS les clients, même ceux qui n’ont aucune commande.',
    'left',
    ['inner', 'right', 'left', 'full-exclusif'],
    'Les clients sont à gauche (FROM clients) : on garde toute la table de gauche, NULL à droite si pas de commande.',
  ),
  questionJointure(
    'Je veux uniquement les clients qui n’ont jamais commandé.',
    'left-exclusif',
    ['left', 'left-exclusif', 'inner', 'right-exclusif'],
    'LEFT JOIN garde tous les clients, puis WHERE o.id IS NULL ne conserve que ceux sans correspondance.',
  ),
  questionJointure(
    'Je veux toutes les commandes, y compris celles dont le client n’existe plus.',
    'right',
    ['left', 'inner', 'right', 'full'],
    'Les commandes sont à droite (JOIN commandes) : RIGHT JOIN garde toute la table de droite.',
  ),
  questionJointure(
    'Je veux détecter les commandes « orphelines », sans client valide.',
    'right-exclusif',
    ['right-exclusif', 'right', 'left-exclusif', 'full'],
    'RIGHT JOIN garde toutes les commandes, puis WHERE c.id IS NULL ne retient que celles sans client.',
  ),
  questionJointure(
    'Je veux tout voir : clients et commandes, avec ou sans correspondance.',
    'full',
    ['inner', 'full', 'left', 'right'],
    'FULL JOIN combine LEFT et RIGHT : aucune ligne n’est perdue, d’un côté comme de l’autre.',
  ),
  questionJointure(
    'Je veux les anomalies des deux côtés : clients sans commande ET commandes sans client.',
    'full-exclusif',
    ['full', 'full-exclusif', 'left-exclusif', 'inner'],
    'FULL JOIN puis WHERE A IS NULL OR B IS NULL : on retire l’intersection et on garde le reste des deux côtés.',
  ),
  {
    categorie: 'Jointures',
    question: 'Dans « A LEFT JOIN B … WHERE B.key IS NULL », que vaut B.key pour les lignes retournées ?',
    options: [
      'NULL, car aucune ligne de B ne correspond',
      '0',
      'La même valeur que A.key',
      'Une chaîne vide',
    ],
    reponse: 0,
    explication:
      'Quand LEFT JOIN ne trouve pas de correspondance, toutes les colonnes de B valent NULL. Le WHERE exploite cela.',
    jointureId: 'left-exclusif',
  },
]

export const QUESTIONS_GENERAL = [
  {
    categorie: 'DDL',
    question: 'Quelle commande crée une nouvelle table ?',
    options: ['CREATE TABLE', 'INSERT TABLE', 'NEW TABLE', 'ADD TABLE'],
    reponse: 0,
    explication: 'CREATE (TABLE, VIEW, INDEX…) fait partie du DDL : il définit la structure.',
  },
  {
    categorie: 'DDL',
    question: 'TRUNCATE TABLE appartient à quelle famille de commandes ?',
    options: ['DML', 'DDL', 'DCL', 'TCL'],
    reponse: 1,
    explication:
      'TRUNCATE vide la table d’un coup en agissant sur sa structure de stockage : c’est du DDL (contrairement à DELETE, qui est du DML).',
  },
  {
    categorie: 'DML',
    question: 'Quelle commande modifie des lignes existantes ?',
    options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'],
    reponse: 2,
    explication: 'UPDATE modifie des données ; ALTER modifie la structure (DDL).',
  },
  {
    categorie: 'DML',
    question: 'Que se passe-t-il si vous exécutez « DELETE FROM clients » sans WHERE ?',
    options: [
      'Rien, le WHERE est obligatoire',
      'Seule la dernière ligne est supprimée',
      'Toutes les lignes de la table sont supprimées',
      'La table est supprimée',
    ],
    reponse: 2,
    explication:
      'Sans WHERE, DELETE (comme UPDATE) s’applique à toutes les lignes. La table, elle, reste en place.',
  },
  {
    categorie: 'DCL',
    question: 'Quelle commande donne des permissions à un utilisateur ?',
    options: ['GIVE', 'GRANT', 'ALLOW', 'PERMIT'],
    reponse: 1,
    explication: 'GRANT accorde des privilèges, REVOKE les retire : c’est le DCL.',
  },
  {
    categorie: 'DCL',
    question: 'Quelle commande retire un privilège accordé ?',
    options: ['REMOVE', 'DENY ALL', 'REVOKE', 'DROP GRANT'],
    reponse: 2,
    explication: 'REVOKE est l’opposé de GRANT.',
  },
  {
    categorie: 'TCL',
    question: 'Quelle commande annule une transaction en cours ?',
    options: ['CANCEL', 'UNDO', 'ROLLBACK', 'REVERT'],
    reponse: 2,
    explication: 'ROLLBACK annule tout ce qui a été fait depuis le début de la transaction ; COMMIT le valide.',
  },
  {
    categorie: 'TCL',
    question: 'Dans le principe ACID, que signifie le « A » ?',
    options: ['Autorisation', 'Atomicité', 'Authentification', 'Archivage'],
    reponse: 1,
    explication:
      'Atomicité : une transaction est « tout ou rien ». Un virement ne peut pas débiter un compte sans créditer l’autre.',
  },
  {
    categorie: 'Fonctions',
    question: 'Quelle est la différence principale entre une fonction et une procédure stockée ?',
    options: [
      'Une fonction retourne une valeur, pas une procédure',
      'Une procédure est toujours plus rapide',
      'Il n’y en a aucune',
      'Les fonctions ne peuvent pas avoir de paramètres',
    ],
    reponse: 0,
    explication:
      'Une fonction retourne une valeur et s’utilise dans une requête (SELECT ma_fonction(…)). Une procédure s’appelle avec CALL.',
  },
  {
    categorie: 'Vues',
    question: 'Que contient réellement une vue (VIEW) ?',
    options: [
      'Une copie physique des données',
      'La requête SELECT qui la définit',
      'Un index',
      'Une sauvegarde automatique',
    ],
    reponse: 1,
    explication:
      'Une vue est une requête enregistrée sous un nom : elle ne stocke pas les données, elle les recalcule à chaque lecture.',
  },
  {
    categorie: 'Index',
    question: 'Quel est le principal inconvénient d’un index ?',
    options: [
      'Il ralentit les SELECT',
      'Il ralentit les INSERT, UPDATE et DELETE et occupe de l’espace',
      'Il supprime les doublons',
      'Il empêche les jointures',
    ],
    reponse: 1,
    explication:
      'Un index accélère les lectures, mais doit être mis à jour à chaque écriture. D’où : indexer ce qui est souvent filtré ou joint, pas tout.',
  },
  {
    categorie: 'Index',
    question: 'Quelle colonne est un bon candidat à l’indexation ?',
    options: [
      'Une colonne jamais utilisée dans les requêtes',
      'Une clé étrangère utilisée dans des jointures',
      'Une colonne qui change à chaque seconde',
      'Une colonne avec une seule valeur possible',
    ],
    reponse: 1,
    explication: 'Les colonnes de jointure (clés étrangères) et de filtrage fréquent bénéficient le plus d’un index.',
  },
  {
    categorie: 'Procédures',
    question: 'Dans une procédure stockée, que signifie un paramètre OUT ?',
    options: [
      'Un paramètre en entrée seulement',
      'Un paramètre qui renvoie une valeur à l’appelant',
      'Un paramètre optionnel',
      'Un paramètre ignoré',
    ],
    reponse: 1,
    explication: 'IN : entrée. OUT : sortie. INOUT : les deux.',
  },
  {
    categorie: 'Triggers',
    question: 'Quand s’exécute un trigger BEFORE INSERT ?',
    options: [
      'Après l’insertion',
      'Avant l’insertion, ce qui permet de valider ou rejeter la ligne',
      'Au démarrage de la base',
      'Seulement si on l’appelle avec CALL',
    ],
    reponse: 1,
    explication: 'BEFORE s’exécute avant l’écriture (validation, normalisation). AFTER s’exécute après (journalisation, audit).',
  },
  {
    categorie: 'Triggers',
    question: 'Dans un trigger, que désigne NEW ?',
    options: [
      'La table créée en dernier',
      'Les nouvelles valeurs de la ligne insérée ou modifiée',
      'Le nouvel utilisateur',
      'La prochaine transaction',
    ],
    reponse: 1,
    explication: 'NEW donne les valeurs après l’opération, OLD les valeurs avant (UPDATE, DELETE).',
  },
]
