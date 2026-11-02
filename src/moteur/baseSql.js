import urlWasm from 'sql.js/dist/sql-wasm-browser.wasm?url'

// Base d'exemple utilisée partout dans l'appli (jointures, éditeur, exercices).
// Volontairement « imparfaite » pour voir la différence entre les jointures :
//  - Fatou (3) et Awa (5) n'ont jamais commandé
//  - la commande 6 pointe vers un client inexistant (99) et la 7 n'a pas de client (NULL)
//  - l'Imprimante (6) n'a jamais été commandée
export const SCHEMA_SQL = `
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  ville TEXT,
  email TEXT
);
CREATE TABLE produits (
  id INTEGER PRIMARY KEY,
  nom TEXT NOT NULL,
  categorie TEXT,
  prix INTEGER NOT NULL,
  stock INTEGER NOT NULL
);
CREATE TABLE commandes (
  id INTEGER PRIMARY KEY,
  client_id INTEGER,
  produit_id INTEGER,
  quantite INTEGER NOT NULL,
  date_commande TEXT NOT NULL
);

INSERT INTO clients (id, nom, ville, email) VALUES
  (1, 'Aminata Diop', 'Dakar', 'aminata@mail.sn'),
  (2, 'Moussa Sow', 'Thiès', 'moussa@mail.sn'),
  (3, 'Fatou Fall', 'Saint-Louis', 'fatou@mail.sn'),
  (4, 'Ibrahima Ndiaye', 'Dakar', 'ibrahima@mail.sn'),
  (5, 'Awa Ba', 'Ziguinchor', 'awa@mail.sn');

INSERT INTO produits (id, nom, categorie, prix, stock) VALUES
  (1, 'Ordinateur portable', 'Informatique', 450000, 12),
  (2, 'Souris sans fil', 'Accessoires', 8000, 60),
  (3, 'Clavier', 'Accessoires', 15000, 40),
  (4, 'Écran 24 pouces', 'Informatique', 90000, 8),
  (5, 'Câble HDMI', 'Accessoires', 3000, 0),
  (6, 'Imprimante', 'Informatique', 120000, 5);

INSERT INTO commandes (id, client_id, produit_id, quantite, date_commande) VALUES
  (1, 1, 1, 1, '2026-01-10'),
  (2, 1, 2, 2, '2026-01-12'),
  (3, 2, 3, 1, '2026-02-03'),
  (4, 4, 4, 1, '2026-02-15'),
  (5, 4, 2, 3, '2026-03-01'),
  (6, 99, 5, 2, '2026-03-05'),
  (7, NULL, 3, 1, '2026-03-20');
`

// Description des tables affichée dans l'éditeur
export const TABLES_DOC = [
  { nom: 'clients', colonnes: ['id', 'nom', 'ville', 'email'] },
  { nom: 'produits', colonnes: ['id', 'nom', 'categorie', 'prix', 'stock'] },
  { nom: 'commandes', colonnes: ['id', 'client_id', 'produit_id', 'quantite', 'date_commande'] },
]

let promesseSql = null

// Charge sql.js (SQLite compilé en WebAssembly) une seule fois, à la demande.
// La promesse est partagée : elle est compatible avec `use()` de React et le <Suspense>.
export function chargerSql() {
  promesseSql ??= import('sql.js').then((module) => {
    const initialiserSql = module.default ?? module
    return initialiserSql({ locateFile: () => urlWasm })
  })
  return promesseSql
}

export function creerBase(SQL) {
  const base = new SQL.Database()
  base.run(SCHEMA_SQL)
  return base
}

// Exécute une ou plusieurs instructions. Retourne les jeux de résultats ou l'erreur SQLite.
export function executer(base, requete) {
  const debut = performance.now()
  try {
    const resultats = base.exec(requete).map(({ columns, values }) => ({
      colonnes: columns,
      lignes: values,
    }))
    return {
      ok: true,
      resultats,
      modifiees: base.getRowsModified(),
      duree: Math.round(performance.now() - debut),
    }
  } catch (erreur) {
    return { ok: false, erreur: erreur instanceof Error ? erreur.message : String(erreur) }
  }
}
