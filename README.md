# SENSqL

Application PWA d'apprentissage de SQL : jointures en diagrammes de Venn, vrai moteur SQL (SQLite/WebAssembly)
dans le navigateur, exercices corrigés automatiquement, quiz, niveaux et badges. Fonctionne hors ligne.

Créé par **Alioune Badara Diop**.

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # développement (le service worker PWA n'est actif qu'en build)
npm run build        # build de production (génère dist/ + sw.js + manifest)
npm run preview      # tester le build, PWA comprise : http://localhost:4173
npm run lint         # ESLint
npm run icones       # régénérer le logo et les icônes PNG (scripts/generer-icones.mjs)
```

## Arborescence

```
SqlApp/
├── index.html                  métadonnées PWA, icône iOS
├── vite.config.js              Vite + vite-plugin-pwa (manifest, cache hors ligne)
├── tailwind.config.js          palette (variables CSS clair/sombre), polices
├── vercel.json                 en-têtes (sw.js jamais mis en cache)
├── public/
│   ├── favicon.svg
│   └── icons/                  icon-192, icon-512, icon-maskable-512, apple-touch-icon, logo.svg
├── scripts/generer-icones.mjs  génère le logo et les PNG
└── src/
    ├── main.jsx · App.jsx · index.css · routage.js
    ├── moteur/                 baseSql.js (SQLite), verification.js, progression.js, parcours.js, theme.js
    ├── donnees/                jointures.js, concepts.js, exercices.js, quiz.js
    ├── contexte/               progression (état global + localStorage)
    ├── hooks/                  useRoute, useProgression, useInstallationPwa, useTheme
    ├── composants/             Logo, DiagrammeVenn, BlocSql, TableauResultat, Quiz, Navigation…
    └── pages/                  Accueil, Jointures, Concepts, Editeur, Exercices, QuizPage, Progression
```

## Ajouter un exercice

Dans `src/donnees/exercices.js`, ajoutez un objet à `EXERCICES` :

- `type: 'select'` : le résultat de la requête de l'élève est comparé à celui de `solution`
- `type: 'modif'` : on compare le contenu de `tableVerif` après exécution (INSERT, UPDATE, DELETE, CREATE VIEW…)
- `type: 'ddl'` : on compare la structure de `tableVerif` (colonnes, NOT NULL, clé primaire)

## Installation sur téléphone

- Android (Chrome / Edge) : bouton « Installer l'appli » sur l'accueil, ou menu ⋮ → Installer l'application
- iPhone (Safari) : Partager → Sur l'écran d'accueil
