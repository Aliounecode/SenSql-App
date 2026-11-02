// Exercices corrigés automatiquement : la requête de l'élève est EXÉCUTÉE sur la base d'exemple,
// puis son résultat est comparé à celui de `solution`.
//   type 'select' : on compare le résultat de la requête
//   type 'modif'  : on compare le contenu de `tableVerif` après exécution
//   type 'ddl'    : on compare la structure de `tableVerif` (noms, NOT NULL, clé primaire)

export const DIFFICULTES = {
  facile: { libelle: 'Facile', xp: 15, classe: 'bg-ok/15 text-ok' },
  moyen: { libelle: 'Moyen', xp: 25, classe: 'bg-alerte/15 text-alerte' },
  difficile: { libelle: 'Difficile', xp: 40, classe: 'bg-erreur/15 text-erreur' },
}

export const EXERCICES = [
  {
    id: 'select-dakar',
    categorie: 'DML',
    difficulte: 'facile',
    titre: 'Clients de Dakar',
    enonce: 'Affichez toutes les colonnes des clients qui habitent à Dakar.',
    indice: 'SELECT * FROM … WHERE ville = \'…\'',
    type: 'select',
    solution: "SELECT * FROM clients WHERE ville = 'Dakar'",
  },
  {
    id: 'select-prix',
    categorie: 'DML',
    difficulte: 'facile',
    titre: 'Produits chers',
    enonce:
      'Affichez le nom et le prix des produits à plus de 10 000 FCFA, du plus cher au moins cher.',
    indice: 'Pensez à ORDER BY prix DESC.',
    type: 'select',
    solution: 'SELECT nom, prix FROM produits WHERE prix > 10000 ORDER BY prix DESC',
  },
  {
    id: 'compter-accessoires',
    categorie: 'DML',
    difficulte: 'facile',
    titre: 'Compter les accessoires',
    enonce: 'Combien y a-t-il de produits dans la catégorie « Accessoires » ?',
    indice: 'La fonction COUNT(*) compte les lignes.',
    type: 'select',
    solution: "SELECT COUNT(*) FROM produits WHERE categorie = 'Accessoires'",
  },
  {
    id: 'creer-fournisseurs',
    categorie: 'DDL',
    difficulte: 'facile',
    titre: 'Créer une table',
    enonce:
      'Créez la table « fournisseurs » avec : id (clé primaire), nom (texte, obligatoire) et telephone (texte).',
    indice: 'CREATE TABLE fournisseurs (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, …)',
    type: 'ddl',
    tableVerif: 'fournisseurs',
    solution:
      'CREATE TABLE fournisseurs (id INTEGER PRIMARY KEY, nom TEXT NOT NULL, telephone TEXT)',
  },
  {
    id: 'inserer-client',
    categorie: 'DML',
    difficulte: 'facile',
    titre: 'Insérer un client',
    enonce:
      'Ajoutez le client Cheikh Gaye, ville Kaolack, email cheikh@mail.sn (laissez l’id se générer).',
    indice: 'INSERT INTO clients (nom, ville, email) VALUES (…)',
    type: 'modif',
    tableVerif: 'clients',
    solution:
      "INSERT INTO clients (nom, ville, email) VALUES ('Cheikh Gaye', 'Kaolack', 'cheikh@mail.sn')",
  },
  {
    id: 'maj-stock',
    categorie: 'DML',
    difficulte: 'facile',
    titre: 'Réapprovisionner un produit',
    enonce: 'Mettez le stock du produit « Câble HDMI » à 50.',
    indice: 'N’oubliez pas le WHERE, sinon tous les produits seront modifiés !',
    type: 'modif',
    tableVerif: 'produits',
    solution: "UPDATE produits SET stock = 50 WHERE nom = 'Câble HDMI'",
  },
  {
    id: 'inner-join',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'INNER JOIN',
    enonce:
      'Listez le nom de chaque client et la date de ses commandes (uniquement les clients qui ont commandé). Colonnes : nom, date_commande.',
    indice: 'FROM clients c INNER JOIN commandes o ON c.id = o.client_id',
    type: 'select',
    solution:
      'SELECT c.nom, o.date_commande FROM clients c INNER JOIN commandes o ON c.id = o.client_id',
  },
  {
    id: 'left-join',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'LEFT JOIN',
    enonce:
      'Listez TOUS les clients avec l’id de leurs commandes (NULL s’ils n’ont rien commandé). Colonnes : nom, id de la commande.',
    indice: 'Pour garder tous les clients, ils doivent être la table de gauche d’un LEFT JOIN.',
    type: 'select',
    solution: 'SELECT c.nom, o.id FROM clients c LEFT JOIN commandes o ON c.id = o.client_id',
  },
  {
    id: 'left-exclusif',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'Clients sans commande',
    enonce: 'Quels clients n’ont jamais commandé ? Affichez uniquement leur nom.',
    indice: 'LEFT JOIN puis WHERE o.id IS NULL.',
    type: 'select',
    solution:
      'SELECT c.nom FROM clients c LEFT JOIN commandes o ON c.id = o.client_id WHERE o.id IS NULL',
  },
  {
    id: 'right-exclusif',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'Commandes orphelines',
    enonce:
      'Trouvez les commandes dont le client n’existe pas dans la table clients. Affichez uniquement l’id de la commande.',
    indice: 'RIGHT JOIN (ou LEFT JOIN en inversant les tables), puis WHERE c.id IS NULL.',
    type: 'select',
    solution:
      'SELECT o.id FROM clients c RIGHT JOIN commandes o ON c.id = o.client_id WHERE c.id IS NULL',
  },
  {
    id: 'full-exclusif',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'Anomalies des deux côtés',
    enonce:
      'Avec un FULL JOIN, affichez les lignes où il manque un côté : clients sans commande ET commandes sans client. Colonnes : c.nom, o.id.',
    indice: 'WHERE c.id IS NULL OR o.id IS NULL',
    type: 'select',
    solution:
      'SELECT c.nom, o.id FROM clients c FULL JOIN commandes o ON c.id = o.client_id WHERE c.id IS NULL OR o.id IS NULL',
  },
  {
    id: 'compter-par-client',
    categorie: 'Jointures',
    difficulte: 'moyen',
    titre: 'Nombre de commandes par client',
    enonce:
      'Pour chaque client (même sans commande), affichez son nom et le nombre de ses commandes.',
    indice: 'COUNT(o.id) ignore les NULL, contrairement à COUNT(*). Ajoutez un GROUP BY.',
    type: 'select',
    solution:
      'SELECT c.nom, COUNT(o.id) AS nb_commandes FROM clients c LEFT JOIN commandes o ON c.id = o.client_id GROUP BY c.id',
  },
  {
    id: 'trois-tables',
    categorie: 'Jointures',
    difficulte: 'difficile',
    titre: 'Jointure sur trois tables',
    enonce:
      'Pour chaque commande dont le client existe, affichez le nom du client, le nom du produit et le total (quantité × prix). Colonnes : client, produit, total.',
    indice: 'Enchaînez deux JOIN : commandes → clients, puis commandes → produits.',
    type: 'select',
    solution:
      'SELECT c.nom, p.nom, o.quantite * p.prix FROM commandes o INNER JOIN clients c ON c.id = o.client_id INNER JOIN produits p ON p.id = o.produit_id',
  },
  {
    id: 'ca-par-ville',
    categorie: 'Jointures',
    difficulte: 'difficile',
    titre: 'Chiffre d’affaires par ville',
    enonce:
      'Calculez le chiffre d’affaires (SUM de quantité × prix) par ville de client, du plus grand au plus petit. Colonnes : ville, ca.',
    indice: 'Trois tables, un GROUP BY c.ville et un ORDER BY sur l’alias ca.',
    type: 'select',
    solution:
      'SELECT c.ville, SUM(o.quantite * p.prix) AS ca FROM commandes o JOIN clients c ON c.id = o.client_id JOIN produits p ON p.id = o.produit_id GROUP BY c.ville ORDER BY ca DESC',
  },
  {
    id: 'creer-vue',
    categorie: 'Vues',
    difficulte: 'difficile',
    titre: 'Créer une vue',
    enonce:
      'Créez la vue « clients_actifs » (colonnes id, nom) qui liste les clients ayant au moins une commande.',
    indice: 'CREATE VIEW … AS SELECT … WHERE id IN (SELECT client_id FROM commandes)',
    type: 'modif',
    tableVerif: 'clients_actifs',
    solution:
      'CREATE VIEW clients_actifs AS SELECT id, nom FROM clients WHERE id IN (SELECT client_id FROM commandes)',
  },
]
