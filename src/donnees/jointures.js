// Les 7 jointures de l'image de départ. A = clients (gauche), B = commandes (droite).
// `zones` indique quelles parties du diagramme de Venn sont retournées.

export const JOINTURES = [
  {
    id: 'inner',
    nom: 'INNER JOIN',
    court: 'INNER',
    zones: { gauche: false, inter: true, droite: false },
    resume: 'Ne garde que les lignes qui ont une correspondance des deux côtés.',
    enFrancais: 'Les clients qui ont commandé, avec leurs commandes.',
    sqlGenerique: `SELECT *
FROM A
INNER JOIN B ON A.key = B.key`,
    sqlExemple: `SELECT c.nom, o.id AS commande, o.date_commande
FROM clients c
INNER JOIN commandes o ON c.id = o.client_id`,
    piege: 'Un client sans commande disparaît du résultat. Une commande sans client aussi.',
  },
  {
    id: 'left',
    nom: 'LEFT JOIN',
    court: 'LEFT',
    zones: { gauche: true, inter: true, droite: false },
    resume: 'Garde toutes les lignes de A, avec NULL du côté de B quand il n’y a pas de correspondance.',
    enFrancais: 'Tous les clients, avec leurs commandes s’ils en ont.',
    sqlGenerique: `SELECT *
FROM A
LEFT JOIN B ON A.key = B.key`,
    sqlExemple: `SELECT c.nom, o.id AS commande, o.date_commande
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id`,
    piege: 'Si vous filtrez sur une colonne de B dans le WHERE (ex. o.date_commande > …), les NULL sont éliminés et le LEFT JOIN se comporte comme un INNER JOIN. Mettez ce filtre dans le ON.',
  },
  {
    id: 'left-exclusif',
    nom: 'LEFT JOIN + WHERE B IS NULL',
    court: 'LEFT exclusif',
    zones: { gauche: true, inter: false, droite: false },
    resume: 'Les lignes de A qui n’ont aucune correspondance dans B.',
    enFrancais: 'Les clients qui n’ont jamais commandé.',
    sqlGenerique: `SELECT *
FROM A
LEFT JOIN B ON A.key = B.key
WHERE B.key IS NULL`,
    sqlExemple: `SELECT c.nom, c.ville
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id
WHERE o.id IS NULL`,
    piege: 'Testez toujours IS NULL sur la clé primaire de B (o.id), jamais sur une colonne qui peut déjà être NULL dans les données.',
  },
  {
    id: 'right',
    nom: 'RIGHT JOIN',
    court: 'RIGHT',
    zones: { gauche: false, inter: true, droite: true },
    resume: 'Garde toutes les lignes de B, avec NULL du côté de A quand il n’y a pas de correspondance.',
    enFrancais: 'Toutes les commandes, avec leur client s’il existe.',
    sqlGenerique: `SELECT *
FROM A
RIGHT JOIN B ON A.key = B.key`,
    sqlExemple: `SELECT c.nom, o.id AS commande, o.date_commande
FROM clients c
RIGHT JOIN commandes o ON c.id = o.client_id`,
    piege: 'Un RIGHT JOIN peut toujours se réécrire en LEFT JOIN en échangeant les deux tables. Beaucoup d’équipes n’utilisent que LEFT pour la lisibilité.',
  },
  {
    id: 'right-exclusif',
    nom: 'RIGHT JOIN + WHERE A IS NULL',
    court: 'RIGHT exclusif',
    zones: { gauche: false, inter: false, droite: true },
    resume: 'Les lignes de B qui n’ont aucune correspondance dans A.',
    enFrancais: 'Les commandes « orphelines » : client inconnu ou absent.',
    sqlGenerique: `SELECT *
FROM A
RIGHT JOIN B ON A.key = B.key
WHERE A.key IS NULL`,
    sqlExemple: `SELECT o.id AS commande, o.client_id, o.date_commande
FROM clients c
RIGHT JOIN commandes o ON c.id = o.client_id
WHERE c.id IS NULL`,
    piege: 'C’est la requête idéale pour détecter les données incohérentes (clés étrangères qui pointent dans le vide).',
  },
  {
    id: 'full',
    nom: 'FULL JOIN',
    court: 'FULL',
    zones: { gauche: true, inter: true, droite: true },
    resume: 'Garde toutes les lignes des deux tables, avec NULL du côté manquant.',
    enFrancais: 'Tous les clients et toutes les commandes, liés quand c’est possible.',
    sqlGenerique: `SELECT *
FROM A
FULL JOIN B ON A.key = B.key`,
    sqlExemple: `SELECT c.nom, o.id AS commande, o.date_commande
FROM clients c
FULL JOIN commandes o ON c.id = o.client_id`,
    piege: 'MySQL ne supporte pas FULL JOIN : on le simule avec un UNION d’un LEFT JOIN et d’un RIGHT JOIN. PostgreSQL, SQL Server et SQLite (≥ 3.39) le supportent.',
  },
  {
    id: 'full-exclusif',
    nom: 'FULL JOIN + WHERE A ou B IS NULL',
    court: 'FULL exclusif',
    zones: { gauche: true, inter: false, droite: true },
    resume: 'Tout sauf l’intersection : les lignes sans correspondance, des deux côtés.',
    enFrancais: 'Les clients sans commande ET les commandes sans client.',
    sqlGenerique: `SELECT *
FROM A
FULL JOIN B ON A.key = B.key
WHERE A.key IS NULL
   OR B.key IS NULL`,
    sqlExemple: `SELECT c.nom, o.id AS commande
FROM clients c
FULL JOIN commandes o ON c.id = o.client_id
WHERE c.id IS NULL
   OR o.id IS NULL`,
    piege: 'Le OR est essentiel : avec AND, la condition ne serait jamais vraie et vous n’auriez aucune ligne.',
  },
]

export const A_RETENIR = [
  { cle: 'INNER', texte: 'Intersection : uniquement les correspondances.' },
  { cle: 'LEFT', texte: 'Tout A, plus ce qui correspond dans B.' },
  { cle: 'RIGHT', texte: 'Tout B, plus ce qui correspond dans A.' },
  { cle: 'FULL', texte: 'Tout A et tout B, correspondance ou non.' },
  { cle: 'IS NULL', texte: 'Ajouté après un LEFT/RIGHT/FULL, il retire l’intersection.' },
]
