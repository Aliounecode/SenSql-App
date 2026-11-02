// Concepts fondamentaux de SQL.
// `essayable: true` : l'exemple fonctionne tel quel dans l'éditeur (SQLite).
// Les autres (GRANT, procédures, fonctions utilisateur…) n'existent pas dans SQLite : syntaxe MySQL / PostgreSQL.

export const CONCEPTS = [
  {
    id: 'ddl',
    sigle: 'DDL',
    nom: 'Data Definition Language',
    couleur: 'bg-a/15 text-a',
    resume:
      'Définit la structure de la base : créer, modifier et supprimer des tables, vues, index…',
    commandes: ['CREATE', 'ALTER', 'DROP', 'TRUNCATE'],
    exemples: [
      {
        titre: 'Créer une table',
        essayable: true,
        code: `CREATE TABLE fournisseurs (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  telephone TEXT UNIQUE
);

SELECT * FROM fournisseurs;`,
      },
      {
        titre: 'Ajouter une colonne',
        essayable: true,
        code: `ALTER TABLE clients ADD COLUMN telephone TEXT;

SELECT * FROM clients;`,
      },
      {
        titre: 'Supprimer une table',
        essayable: true,
        code: `CREATE TABLE temporaire (id INTEGER);
DROP TABLE temporaire;`,
      },
      {
        titre: 'Vider une table (MySQL / PostgreSQL)',
        essayable: false,
        code: `TRUNCATE TABLE journal;`,
      },
    ],
    aRetenir: [
      'Le DDL agit sur la structure, pas sur les lignes.',
      'CREATE crée, ALTER modifie, DROP supprime définitivement.',
      'TRUNCATE vide une table beaucoup plus vite que DELETE, mais ne se filtre pas avec WHERE.',
    ],
    erreur: 'DROP TABLE est irréversible hors transaction : relisez deux fois le nom de la table.',
  },
  {
    id: 'dml',
    sigle: 'DML',
    nom: 'Data Manipulation Language',
    couleur: 'bg-b/15 text-b',
    resume: 'Lit et modifie les données contenues dans les tables.',
    commandes: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
    exemples: [
      {
        titre: 'Insérer',
        essayable: true,
        code: `INSERT INTO clients (nom, ville, email)
VALUES ('Cheikh Gaye', 'Kaolack', 'cheikh@mail.sn');

SELECT * FROM clients;`,
      },
      {
        titre: 'Modifier',
        essayable: true,
        code: `UPDATE produits
SET stock = 50
WHERE nom = 'Câble HDMI';

SELECT nom, stock FROM produits;`,
      },
      {
        titre: 'Consulter avec un filtre',
        essayable: true,
        code: `SELECT nom, ville
FROM clients
WHERE nom LIKE 'A%';`,
      },
      {
        titre: 'Supprimer',
        essayable: true,
        code: `DELETE FROM commandes
WHERE client_id IS NULL;

SELECT * FROM commandes;`,
      },
    ],
    aRetenir: [
      'SELECT lit, INSERT ajoute, UPDATE modifie, DELETE supprime des lignes.',
      'UPDATE et DELETE sans WHERE touchent toutes les lignes.',
      'Écrivez d’abord le SELECT avec le même WHERE pour vérifier ce que vous allez modifier.',
    ],
    erreur: 'Oublier le WHERE : c’est l’erreur la plus coûteuse de SQL.',
  },
  {
    id: 'dcl',
    sigle: 'DCL',
    nom: 'Data Control Language',
    couleur: 'bg-ok/15 text-ok',
    resume: 'Gère les droits d’accès : qui peut lire, écrire ou administrer quoi.',
    commandes: ['GRANT', 'REVOKE'],
    exemples: [
      {
        titre: 'Donner des droits (PostgreSQL)',
        essayable: false,
        code: `GRANT SELECT, INSERT ON clients TO utilisateur1;`,
      },
      {
        titre: 'Retirer un droit',
        essayable: false,
        code: `REVOKE INSERT ON clients FROM utilisateur1;`,
      },
      {
        titre: 'Lecture seule pour un rôle (PostgreSQL)',
        essayable: false,
        code: `CREATE ROLE lecteur;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO lecteur;`,
      },
    ],
    aRetenir: [
      'Appliquez le principe du moindre privilège : donnez le strict nécessaire.',
      'GRANT accorde, REVOKE retire.',
      'Les rôles évitent de répéter les droits utilisateur par utilisateur.',
    ],
    erreur: 'Donner ALL PRIVILEGES « pour aller vite » à une application : une faille SQL devient alors catastrophique.',
  },
  {
    id: 'tcl',
    sigle: 'TCL',
    nom: 'Transaction Control Language',
    couleur: 'bg-alerte/15 text-alerte',
    resume: 'Regroupe plusieurs opérations en un bloc « tout ou rien » pour garder la base cohérente.',
    commandes: ['BEGIN', 'COMMIT', 'ROLLBACK', 'SAVEPOINT'],
    exemples: [
      {
        titre: 'Valider une transaction',
        essayable: true,
        code: `BEGIN;
UPDATE produits SET stock = stock - 1 WHERE id = 1;
UPDATE produits SET stock = stock + 1 WHERE id = 6;
COMMIT;

SELECT id, nom, stock FROM produits;`,
      },
      {
        titre: 'Annuler avec ROLLBACK',
        essayable: true,
        code: `BEGIN;
DELETE FROM clients;
SELECT COUNT(*) AS apres_suppression FROM clients;
ROLLBACK;

SELECT COUNT(*) AS apres_rollback FROM clients;`,
      },
      {
        titre: 'Point de sauvegarde',
        essayable: true,
        code: `BEGIN;
UPDATE produits SET prix = prix * 2;
SAVEPOINT apres_hausse;
DELETE FROM produits WHERE stock = 0;
ROLLBACK TO apres_hausse;
COMMIT;

SELECT nom, prix FROM produits;`,
      },
    ],
    aRetenir: [
      'Une transaction est atomique : tout réussit, ou rien n’est appliqué.',
      'COMMIT valide, ROLLBACK annule, SAVEPOINT permet un retour partiel.',
      'ACID : Atomicité, Cohérence, Isolation, Durabilité.',
    ],
    erreur: 'Laisser une transaction ouverte trop longtemps : elle peut bloquer les autres utilisateurs.',
  },
  {
    id: 'fonctions',
    sigle: 'FN',
    nom: 'Fonctions',
    couleur: 'bg-a/15 text-a',
    resume: 'Blocs de calcul qui retournent une valeur, utilisables directement dans une requête.',
    commandes: ['COUNT', 'SUM', 'UPPER', 'CREATE FUNCTION'],
    exemples: [
      {
        titre: 'Fonctions intégrées',
        essayable: true,
        code: `SELECT UPPER(nom) AS nom_majuscule,
       LENGTH(nom) AS longueur,
       SUBSTR(ville, 1, 3) AS ville_abregee
FROM clients;`,
      },
      {
        titre: 'Fonctions d’agrégation',
        essayable: true,
        code: `SELECT categorie,
       COUNT(*) AS nb_produits,
       ROUND(AVG(prix)) AS prix_moyen,
       SUM(stock) AS stock_total
FROM produits
GROUP BY categorie;`,
      },
      {
        titre: 'Fonction utilisateur (MySQL)',
        essayable: false,
        code: `CREATE FUNCTION calculer_tva(prix DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN prix * 0.18;
END;

SELECT nom, prix, calculer_tva(prix) AS tva FROM produits;`,
      },
    ],
    aRetenir: [
      'Une fonction retourne toujours une valeur et s’utilise dans SELECT, WHERE, ORDER BY…',
      'Fonctions d’agrégation : COUNT, SUM, AVG, MIN, MAX (avec GROUP BY).',
      'SQLite n’a pas de CREATE FUNCTION ; MySQL et PostgreSQL oui.',
    ],
    erreur: 'Appeler une fonction sur une colonne dans un WHERE peut empêcher l’usage de l’index sur cette colonne.',
  },
  {
    id: 'vues',
    sigle: 'VIEW',
    nom: 'Vues',
    couleur: 'bg-b/15 text-b',
    resume: 'Une requête enregistrée sous un nom, que l’on interroge comme une table.',
    commandes: ['CREATE VIEW', 'DROP VIEW'],
    exemples: [
      {
        titre: 'Vue simple',
        essayable: true,
        code: `CREATE VIEW clients_dakar AS
SELECT id, nom, email
FROM clients
WHERE ville = 'Dakar';

SELECT * FROM clients_dakar;`,
      },
      {
        titre: 'Vue avec jointures',
        essayable: true,
        code: `CREATE VIEW commandes_detail AS
SELECT o.id AS commande,
       c.nom AS client,
       p.nom AS produit,
       o.quantite * p.prix AS total
FROM commandes o
JOIN clients c ON c.id = o.client_id
JOIN produits p ON p.id = o.produit_id;

SELECT * FROM commandes_detail;`,
      },
    ],
    aRetenir: [
      'Une vue ne stocke pas de données : elle exécute sa requête à chaque lecture.',
      'Elle simplifie les requêtes complexes et masque des colonnes sensibles.',
      'Une vue matérialisée (PostgreSQL) stocke, elle, le résultat.',
    ],
    erreur: 'Empiler des vues sur des vues : les performances deviennent difficiles à comprendre.',
  },
  {
    id: 'index',
    sigle: 'IDX',
    nom: 'Index',
    couleur: 'bg-ok/15 text-ok',
    resume: 'Structure qui accélère les recherches, comme l’index à la fin d’un livre.',
    commandes: ['CREATE INDEX', 'CREATE UNIQUE INDEX', 'DROP INDEX'],
    exemples: [
      {
        titre: 'Créer un index et vérifier son usage',
        essayable: true,
        code: `CREATE INDEX idx_clients_ville ON clients(ville);

EXPLAIN QUERY PLAN
SELECT * FROM clients WHERE ville = 'Dakar';`,
      },
      {
        titre: 'Index sur une clé étrangère',
        essayable: true,
        code: `CREATE INDEX idx_commandes_client ON commandes(client_id);

EXPLAIN QUERY PLAN
SELECT * FROM commandes WHERE client_id = 1;`,
      },
      {
        titre: 'Index unique : refuse les doublons',
        essayable: true,
        code: `CREATE UNIQUE INDEX idx_clients_email ON clients(email);

-- Cette insertion doit échouer : cet email existe déjà
INSERT INTO clients (nom, ville, email)
VALUES ('Doublon', 'Dakar', 'aminata@mail.sn');`,
      },
    ],
    aRetenir: [
      'Un index accélère SELECT, WHERE, JOIN et ORDER BY.',
      'Il ralentit INSERT/UPDATE/DELETE et consomme de l’espace disque.',
      'Indexez les clés étrangères et les colonnes souvent filtrées, pas tout.',
    ],
    erreur: 'Créer des index « au cas où » : chacun a un coût à chaque écriture.',
  },
  {
    id: 'procedures',
    sigle: 'PROC',
    nom: 'Procédures stockées',
    couleur: 'bg-alerte/15 text-alerte',
    resume: 'Programmes enregistrés dans la base, appelés avec CALL, qui exécutent plusieurs instructions.',
    commandes: ['CREATE PROCEDURE', 'CALL', 'DROP PROCEDURE'],
    exemples: [
      {
        titre: 'Procédure simple (MySQL)',
        essayable: false,
        code: `CREATE PROCEDURE ajouter_client(
  IN p_nom VARCHAR(100),
  IN p_ville VARCHAR(100)
)
BEGIN
  INSERT INTO clients (nom, ville) VALUES (p_nom, p_ville);
END;

CALL ajouter_client('Cheikh Gaye', 'Kaolack');`,
      },
      {
        titre: 'Paramètre de sortie (MySQL)',
        essayable: false,
        code: `CREATE PROCEDURE compter_clients(OUT total INT)
BEGIN
  SELECT COUNT(*) INTO total FROM clients;
END;

CALL compter_clients(@nb);
SELECT @nb;`,
      },
    ],
    aRetenir: [
      'Paramètres IN (entrée), OUT (sortie) et INOUT (les deux).',
      'Une procédure ne retourne pas de valeur comme une fonction ; elle s’appelle avec CALL.',
      'Elle centralise la logique métier côté base et réduit les allers-retours réseau.',
    ],
    erreur: 'Mettre trop de logique métier en base : elle devient difficile à versionner et à tester.',
  },
  {
    id: 'triggers',
    sigle: 'TRG',
    nom: 'Triggers (déclencheurs)',
    couleur: 'bg-a/15 text-a',
    resume: 'Code qui s’exécute automatiquement quand une table reçoit un INSERT, UPDATE ou DELETE.',
    commandes: ['CREATE TRIGGER', 'BEFORE', 'AFTER', 'DROP TRIGGER'],
    exemples: [
      {
        titre: 'AFTER INSERT : journaliser',
        essayable: true,
        code: `CREATE TABLE journal (
  id INTEGER PRIMARY KEY,
  message TEXT,
  date_log TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_nouvelle_commande
AFTER INSERT ON commandes
BEGIN
  INSERT INTO journal (message)
  VALUES ('Nouvelle commande n° ' || NEW.id);
END;

INSERT INTO commandes (client_id, produit_id, quantite, date_commande)
VALUES (2, 2, 1, '2026-11-01');

SELECT * FROM journal;`,
      },
      {
        titre: 'BEFORE INSERT : valider',
        essayable: true,
        code: `CREATE TRIGGER trg_verifier_email
BEFORE INSERT ON clients
BEGIN
  SELECT RAISE(ABORT, 'Email invalide')
  WHERE NEW.email NOT LIKE '%@%';
END;

INSERT INTO clients (nom, ville, email)
VALUES ('Test', 'Dakar', 'pas-un-email');`,
      },
    ],
    aRetenir: [
      'BEFORE : avant l’écriture (validation). AFTER : après (journal, audit).',
      'NEW désigne les nouvelles valeurs, OLD les anciennes.',
      'Un trigger est invisible pour l’application : documentez-les.',
    ],
    erreur: 'Un trigger qui en déclenche un autre peut provoquer des effets en cascade difficiles à déboguer.',
  },
]
