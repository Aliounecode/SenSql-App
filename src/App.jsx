import React, { useState } from "react";
import {
  BookOpen,
  Code,
  Trophy,
  Award,
  Play,
  CheckCircle,
  XCircle,
  Target,
  Zap,
} from "lucide-react";

// Composant ProgressBar (défini en dehors du composant principal)
const ProgressBar = ({ userProgress, badges, levels }) => {
  if (!userProgress || typeof userProgress.xp === "undefined") {
    return null;
  }

  const currentLevel = levels.find((l) => l.id === userProgress.level);
  const nextLevel = levels.find((l) => l.id === userProgress.level + 1);

  let currentLevelXP = 0;
  let xpForNextLevel = 100;
  let percentage = 0;

  if (currentLevel && nextLevel) {
    currentLevelXP = userProgress.xp - currentLevel.xpRequired;
    xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
    percentage = (currentLevelXP / xpForNextLevel) * 100;
  } else if (!nextLevel) {
    // Niveau max atteint
    percentage = 100;
    currentLevelXP = userProgress.xp;
    xpForNextLevel = userProgress.xp;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <span>{currentLevel?.icon}</span>
            Niveau {userProgress.level} - {currentLevel?.name}
          </h3>
          <p className="text-gray-400">
            {nextLevel
              ? `${currentLevelXP} / ${xpForNextLevel} XP vers niveau ${userProgress.level + 1}`
              : `Niveau maximum atteint! (${userProgress.xp} XP total)`}
          </p>
        </div>
        <div className="text-4xl">{currentLevel?.icon || "🌱"}</div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">XP Total</p>
          <p className="text-2xl font-bold text-green-400">{userProgress.xp}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">Badges</p>
          <p className="text-2xl font-bold text-yellow-400">
            {userProgress.badges.length}/{badges.length}
          </p>
        </div>
      </div>

      {userProgress.badges.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-300">
            Badges débloqués:
          </h4>
          <div className="flex flex-wrap gap-2">
            {userProgress.badges.map((badgeId) => {
              const badge = badges.find((b) => b.id === badgeId);
              return badge ? (
                <div
                  key={badgeId}
                  className="bg-yellow-500/20 border border-yellow-500 px-3 py-1 rounded-full text-sm"
                >
                  {badge.icon} {badge.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant VennDiagram (défini en dehors du composant principal)
const VennDiagram = ({ type }) => {
  const diagrams = {
    intersection: (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <circle cx="140" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <path
          d="M 82.5 25 A 45 45 0 0 1 117.5 95 A 45 45 0 0 1 82.5 25"
          fill="#10b981"
        />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    union: (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#10b981" />
        <circle cx="140" cy="60" r="45" fill="#10b981" />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    "outer-only": (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#10b981" />
        <circle cx="140" cy="60" r="45" fill="#10b981" />
        <path
          d="M 82.5 25 A 45 45 0 0 1 117.5 95 A 45 45 0 0 1 82.5 25"
          fill="#1f2937"
        />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    left: (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#10b981" />
        <circle cx="140" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    "left-only": (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#10b981" />
        <circle cx="140" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <path
          d="M 82.5 25 A 45 45 0 0 1 117.5 95 A 45 45 0 0 1 82.5 25"
          fill="#1f2937"
        />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    right: (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <circle cx="140" cy="60" r="45" fill="#10b981" />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
    "right-only": (
      <svg viewBox="0 0 200 120" className="w-full h-32">
        <circle cx="60" cy="60" r="45" fill="#6b7280" opacity="0.3" />
        <circle cx="140" cy="60" r="45" fill="#10b981" />
        <path
          d="M 82.5 25 A 45 45 0 0 1 117.5 95 A 45 45 0 0 1 82.5 25"
          fill="#1f2937"
        />
        <text x="40" y="65" fill="white" fontSize="20">
          A
        </text>
        <text x="150" y="65" fill="white" fontSize="20">
          B
        </text>
      </svg>
    ),
  };
  return diagrams[type] || diagrams.intersection;
};

const SQLJoinsApp = () => {
  const [selectedJoin, setSelectedJoin] = useState("INNER");
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showGeneralities, setShowGeneralities] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [generalQuizMode, setGeneralQuizMode] = useState(false);
  const [generalCurrentQuestion, setGeneralCurrentQuestion] = useState(0);
  const [generalScore, setGeneralScore] = useState(0);
  const [generalShowResult, setGeneralShowResult] = useState(false);

  // Nouveaux états pour les fonctionnalités
  const [showEditor, setShowEditor] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [sqlCode, setSqlCode] = useState("SELECT * FROM clients;");
  const [sqlResult, setSqlResult] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [exerciseResult, setExerciseResult] = useState(null);

  // Système de progression
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    badges: [],
    completedLessons: [],
    completedQuizzes: [],
    totalScore: 0,
    unlockedLevels: [1], // Niveaux débloqués
  });

  // Définition des niveaux avec leurs requis
  const levels = [
    {
      id: 1,
      name: "Débutant",
      icon: "🌱",
      xpRequired: 0,
      description: "Découvrez les bases de SQL",
      unlocked: true,
    },
    {
      id: 2,
      name: "Apprenti",
      icon: "📚",
      xpRequired: 100,
      description: "Maîtrisez les commandes de base",
      unlocked: false,
    },
    {
      id: 3,
      name: "Intermédiaire",
      icon: "⭐",
      xpRequired: 300,
      description: "Comprenez les jointures",
      unlocked: false,
    },
    {
      id: 4,
      name: "Avancé",
      icon: "💎",
      xpRequired: 600,
      description: "Maîtrisez les concepts avancés",
      unlocked: false,
    },
    {
      id: 5,
      name: "Expert SQL",
      icon: "🏆",
      xpRequired: 1000,
      description: "Vous êtes un maître SQL",
      unlocked: false,
    },
  ];

  const joins = {
    INNER: {
      name: "INNER JOIN",
      description:
        "Retourne uniquement les lignes qui ont une correspondance dans les deux tables",
      diagram: "intersection",
      sql: `SELECT *
FROM A
INNER JOIN B ON A.key = B.key`,
      example: "Obtenir uniquement les clients qui ont passé des commandes",
      color: "bg-green-500",
    },
    FULL: {
      name: "FULL JOIN",
      description:
        "Retourne toutes les lignes des deux tables, avec NULL si pas de correspondance",
      diagram: "union",
      sql: `SELECT *
FROM A
FULL JOIN B ON A.key = B.key`,
      example:
        "Lister tous les clients et toutes les commandes, même sans correspondance",
      color: "bg-green-500",
    },
    "FULL-WHERE": {
      name: "FULL JOIN avec WHERE",
      description: "Retourne les lignes sans correspondance dans l'autre table",
      diagram: "outer-only",
      sql: `SELECT *
FROM A
FULL JOIN B ON A.key = B.key
WHERE A.key IS NULL OR
      B.key IS NULL`,
      example:
        "Trouver les clients sans commandes ET les commandes sans client",
      color: "bg-green-500",
    },
    LEFT: {
      name: "LEFT JOIN",
      description:
        "Retourne toutes les lignes de la table A, avec NULL pour B si pas de correspondance",
      diagram: "left",
      sql: `SELECT *
FROM A
LEFT JOIN B ON A.key = B.key`,
      example: "Lister tous les clients, avec leurs commandes s'ils en ont",
      color: "bg-green-500",
    },
    "LEFT-WHERE": {
      name: "LEFT JOIN avec WHERE",
      description: "Retourne les lignes de A sans correspondance dans B",
      diagram: "left-only",
      sql: `SELECT *
FROM A
LEFT JOIN B ON A.key = B.key
WHERE B.key IS NULL`,
      example: "Trouver les clients qui n'ont jamais passé de commande",
      color: "bg-green-500",
    },
    RIGHT: {
      name: "RIGHT JOIN",
      description:
        "Retourne toutes les lignes de la table B, avec NULL pour A si pas de correspondance",
      diagram: "right",
      sql: `SELECT *
FROM A
RIGHT JOIN B ON A.key = B.key`,
      example: "Lister toutes les commandes, avec le client s'il existe",
      color: "bg-green-500",
    },
    "RIGHT-WHERE": {
      name: "RIGHT JOIN avec WHERE",
      description: "Retourne les lignes de B sans correspondance dans A",
      diagram: "right-only",
      sql: `SELECT *
FROM A
RIGHT JOIN B ON A.key = B.key
WHERE A.key IS NULL`,
      example: "Trouver les commandes sans client associé",
      color: "bg-green-500",
    },
  };

  const quizQuestions = [
    {
      question:
        "Je veux obtenir tous les clients qui ont passé au moins une commande",
      answer: "INNER",
      options: ["INNER", "LEFT", "RIGHT", "FULL"],
    },
    {
      question: "Je veux lister tous les clients, même ceux sans commande",
      answer: "LEFT",
      options: ["INNER", "LEFT", "RIGHT", "FULL"],
    },
    {
      question: "Je veux trouver les clients qui n'ont jamais commandé",
      answer: "LEFT-WHERE",
      options: ["INNER", "LEFT-WHERE", "RIGHT-WHERE", "FULL"],
    },
    {
      question:
        "Je veux toutes les données des deux tables, même sans correspondance",
      answer: "FULL",
      options: ["INNER", "LEFT", "RIGHT", "FULL"],
    },
    {
      question: "Je veux les commandes sans client valide",
      answer: "RIGHT-WHERE",
      options: ["LEFT", "LEFT-WHERE", "RIGHT-WHERE", "FULL-WHERE"],
    },
  ];

  const generalConcepts = {
    DDL: {
      name: "DDL - Data Definition Language",
      description:
        "Langage de définition de données. Permet de créer, modifier et supprimer la structure des objets de la base de données (tables, index, vues...).",
      commands: ["CREATE", "ALTER", "DROP", "TRUNCATE", "RENAME"],
      examples: [
        {
          title: "Créer une table",
          code: `CREATE TABLE clients (
  id INT PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  date_creation DATE
);`,
        },
        {
          title: "Modifier une table",
          code: `ALTER TABLE clients 
ADD COLUMN telephone VARCHAR(20);`,
        },
        {
          title: "Supprimer une table",
          code: `DROP TABLE clients;`,
        },
      ],
      keyPoints: [
        "Les commandes DDL modifient la structure de la base",
        "CREATE : crée de nouveaux objets",
        "ALTER : modifie des objets existants",
        "DROP : supprime des objets",
        "TRUNCATE : vide une table (plus rapide que DELETE)",
      ],
    },
    DML: {
      name: "DML - Data Manipulation Language",
      description:
        "Langage de manipulation de données. Permet d'insérer, modifier, supprimer et consulter les données dans les tables.",
      commands: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      examples: [
        {
          title: "Insérer des données",
          code: `INSERT INTO clients (nom, email) 
VALUES ('Diop', 'diop@email.com');`,
        },
        {
          title: "Modifier des données",
          code: `UPDATE clients 
SET email = 'nouveau@email.com' 
WHERE id = 1;`,
        },
        {
          title: "Consulter des données",
          code: `SELECT * FROM clients 
WHERE nom LIKE 'D%';`,
        },
        {
          title: "Supprimer des données",
          code: `DELETE FROM clients 
WHERE id = 5;`,
        },
      ],
      keyPoints: [
        "Les commandes DML manipulent les données",
        "SELECT : récupère des données",
        "INSERT : ajoute de nouvelles lignes",
        "UPDATE : modifie des lignes existantes",
        "DELETE : supprime des lignes",
      ],
    },
    DCL: {
      name: "DCL - Data Control Language",
      description:
        "Langage de contrôle de données. Permet de gérer les droits et permissions d'accès aux données.",
      commands: ["GRANT", "REVOKE"],
      examples: [
        {
          title: "Donner des permissions",
          code: `GRANT SELECT, INSERT ON clients 
TO utilisateur1;`,
        },
        {
          title: "Révoquer des permissions",
          code: `REVOKE INSERT ON clients 
FROM utilisateur1;`,
        },
        {
          title: "Donner tous les droits",
          code: `GRANT ALL PRIVILEGES ON database.* 
TO 'admin'@'localhost';`,
        },
      ],
      keyPoints: [
        "DCL gère la sécurité et les permissions",
        "GRANT : accorde des privilèges",
        "REVOKE : retire des privilèges",
        "Important pour la sécurité des données",
        "Permet de contrôler qui peut faire quoi",
      ],
    },
    TCL: {
      name: "TCL - Transaction Control Language",
      description:
        "Langage de contrôle des transactions. Permet de gérer les transactions pour assurer l'intégrité des données.",
      commands: ["COMMIT", "ROLLBACK", "SAVEPOINT"],
      examples: [
        {
          title: "Transaction complète",
          code: `BEGIN TRANSACTION;

UPDATE comptes SET solde = solde - 100 
WHERE id = 1;

UPDATE comptes SET solde = solde + 100 
WHERE id = 2;

COMMIT;`,
        },
        {
          title: "Annuler une transaction",
          code: `BEGIN TRANSACTION;

DELETE FROM clients WHERE id = 5;

ROLLBACK;`,
        },
        {
          title: "Utiliser un point de sauvegarde",
          code: `BEGIN TRANSACTION;

UPDATE produits SET prix = prix * 1.1;
SAVEPOINT augmentation;

DELETE FROM produits WHERE stock = 0;

ROLLBACK TO augmentation;
COMMIT;`,
        },
      ],
      keyPoints: [
        "Les transactions garantissent l'intégrité des données",
        "COMMIT : valide définitivement les changements",
        "ROLLBACK : annule les changements",
        "SAVEPOINT : crée un point de restauration",
        "Principe ACID : Atomicité, Cohérence, Isolation, Durabilité",
      ],
    },
    FONCTIONS: {
      name: "Fonctions SQL",
      description:
        "Blocs de code réutilisables qui retournent une valeur. Peuvent être utilisées dans les requêtes SELECT, WHERE, etc.",
      commands: ["CREATE FUNCTION", "DROP FUNCTION"],
      examples: [
        {
          title: "Fonction scalaire simple",
          code: `CREATE FUNCTION calculer_tva(prix DECIMAL(10,2))
RETURNS DECIMAL(10,2)
BEGIN
  RETURN prix * 0.20;
END;

SELECT nom, prix, calculer_tva(prix) AS tva
FROM produits;`,
        },
        {
          title: "Fonction avec condition",
          code: `CREATE FUNCTION statut_commande(total DECIMAL(10,2))
RETURNS VARCHAR(20)
BEGIN
  IF total > 1000 THEN
    RETURN 'VIP';
  ELSEIF total > 500 THEN
    RETURN 'Premium';
  ELSE
    RETURN 'Standard';
  END IF;
END;`,
        },
      ],
      keyPoints: [
        "Les fonctions retournent toujours une valeur",
        "Peuvent être utilisées dans les requêtes",
        "Réutilisables et facilitent la maintenance",
        "Peuvent accepter des paramètres",
        "Différence avec procédures : retournent une valeur",
      ],
    },
    VUES: {
      name: "Vues (Views)",
      description:
        "Tables virtuelles basées sur des requêtes SELECT. Simplifient les requêtes complexes et améliorent la sécurité.",
      commands: ["CREATE VIEW", "DROP VIEW", "ALTER VIEW"],
      examples: [
        {
          title: "Vue simple",
          code: `CREATE VIEW clients_actifs AS
SELECT id, nom, email
FROM clients
WHERE statut = 'actif';

SELECT * FROM clients_actifs;`,
        },
        {
          title: "Vue avec jointure",
          code: `CREATE VIEW commandes_details AS
SELECT 
  c.id,
  c.date_commande,
  cl.nom AS client,
  SUM(p.prix * cd.quantite) AS total
FROM commandes c
JOIN clients cl ON c.client_id = cl.id
JOIN commande_details cd ON c.id = cd.commande_id
JOIN produits p ON cd.produit_id = p.id
GROUP BY c.id, c.date_commande, cl.nom;`,
        },
      ],
      keyPoints: [
        "Les vues sont des tables virtuelles",
        "Ne stockent pas de données, juste la requête",
        "Simplifient les requêtes complexes",
        "Améliorent la sécurité (masquent certaines colonnes)",
        "Peuvent être interrogées comme des tables normales",
      ],
    },
    INDEX: {
      name: "Index",
      description:
        "Structures de données qui améliorent la vitesse de recherche. Comme un index de livre, permettent de trouver rapidement les données.",
      commands: ["CREATE INDEX", "DROP INDEX", "CREATE UNIQUE INDEX"],
      examples: [
        {
          title: "Index simple",
          code: `CREATE INDEX idx_nom 
ON clients(nom);

SELECT * FROM clients WHERE nom = 'Diop';`,
        },
        {
          title: "Index composite",
          code: `CREATE INDEX idx_nom_email 
ON clients(nom, email);

SELECT * FROM clients 
WHERE nom = 'Diop' AND email LIKE '%@email.com';`,
        },
        {
          title: "Index unique",
          code: `CREATE UNIQUE INDEX idx_email_unique 
ON clients(email);`,
        },
      ],
      keyPoints: [
        "Les index accélèrent les recherches (SELECT)",
        "Ralentissent les insertions et modifications",
        "À utiliser sur les colonnes souvent recherchées",
        "Index unique : garantit l'unicité",
        "Ne pas abuser : trop d'index = performances dégradées",
      ],
    },
    PROCEDURES: {
      name: "Procédures Stockées",
      description:
        "Ensemble d'instructions SQL stockées dans la base. Peuvent accepter des paramètres et exécuter des opérations complexes.",
      commands: ["CREATE PROCEDURE", "DROP PROCEDURE", "CALL"],
      examples: [
        {
          title: "Procédure simple",
          code: `CREATE PROCEDURE ajouter_client(
  IN p_nom VARCHAR(100),
  IN p_email VARCHAR(100)
)
BEGIN
  INSERT INTO clients (nom, email)
  VALUES (p_nom, p_email);
END;

CALL ajouter_client('Diop', 'diop@email.com');`,
        },
        {
          title: "Procédure avec OUT",
          code: `CREATE PROCEDURE compter_clients(
  OUT total INT
)
BEGIN
  SELECT COUNT(*) INTO total
  FROM clients;
END;

CALL compter_clients(@nb);
SELECT @nb;`,
        },
      ],
      keyPoints: [
        "Les procédures ne retournent pas de valeur",
        "Peuvent contenir plusieurs instructions SQL",
        "Paramètres IN, OUT, INOUT",
        "Améliorent les performances (code pré-compilé)",
        "Centralisent la logique métier",
      ],
    },
    TRIGGERS: {
      name: "Triggers (Déclencheurs)",
      description:
        "Procédures qui s'exécutent automatiquement en réponse à certains événements (INSERT, UPDATE, DELETE) sur une table.",
      commands: ["CREATE TRIGGER", "DROP TRIGGER"],
      examples: [
        {
          title: "Trigger BEFORE INSERT",
          code: `CREATE TRIGGER verifier_email
BEFORE INSERT ON clients
FOR EACH ROW
BEGIN
  IF NEW.email NOT LIKE '%@%' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Email invalide';
  END IF;
END;`,
        },
        {
          title: "Trigger AFTER INSERT (Audit)",
          code: `CREATE TRIGGER log_nouvelle_commande
AFTER INSERT ON commandes
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (table_name, action, record_id)
  VALUES ('commandes', 'INSERT', NEW.id);
END;`,
        },
      ],
      keyPoints: [
        "S'exécutent automatiquement (pas besoin de les appeler)",
        "BEFORE : avant l'opération (validation)",
        "AFTER : après l'opération (audit, logs)",
        "NEW : nouvelles valeurs, OLD : anciennes valeurs",
        "Attention : peuvent ralentir les opérations",
        "Utiles pour : audit, validation, calculs automatiques",
      ],
    },
  };

  const generalQuizQuestions = [
    {
      question: "Quelle commande permet de créer une nouvelle table ?",
      options: ["CREATE TABLE", "INSERT TABLE", "NEW TABLE", "ADD TABLE"],
      answer: "CREATE TABLE",
      category: "DDL",
    },
    {
      question: "Quelle commande annule une transaction en cours ?",
      options: ["CANCEL", "UNDO", "ROLLBACK", "REVERT"],
      answer: "ROLLBACK",
      category: "TCL",
    },
    {
      question:
        "Quelle commande permet de donner des permissions à un utilisateur ?",
      options: ["GIVE", "GRANT", "ALLOW", "PERMIT"],
      answer: "GRANT",
      category: "DCL",
    },
    {
      question:
        "Quelle est la différence principale entre une fonction et une procédure stockée ?",
      options: [
        "Une fonction retourne une valeur, pas une procédure",
        "Une procédure est plus rapide",
        "Il n'y a pas de différence",
        "Les fonctions ne peuvent pas avoir de paramètres",
      ],
      answer: "Une fonction retourne une valeur, pas une procédure",
      category: "FONCTIONS",
    },
    {
      question: "Qu'est-ce qu'une vue (VIEW) ?",
      options: [
        "Une copie physique d'une table",
        "Une table virtuelle basée sur une requête",
        "Un type d'index",
        "Une sauvegarde automatique",
      ],
      answer: "Une table virtuelle basée sur une requête",
      category: "VUES",
    },
    {
      question: "Quel est l'avantage principal d'un index ?",
      options: [
        "Accélère les recherches",
        "Réduit la taille de la base",
        "Automatise les sauvegardes",
        "Crypte les données",
      ],
      answer: "Accélère les recherches",
      category: "INDEX",
    },
    {
      question: "Quand un trigger BEFORE s'exécute-t-il ?",
      options: [
        "Après l'opération",
        "Avant l'opération",
        "Pendant l'opération",
        "Au démarrage de la base",
      ],
      answer: "Avant l'opération",
      category: "TRIGGERS",
    },
    {
      question:
        "Quelle commande DML permet de modifier des données existantes ?",
      options: ["MODIFY", "CHANGE", "UPDATE", "ALTER"],
      answer: "UPDATE",
      category: "DML",
    },
    {
      question: "TRUNCATE fait partie de quel type de commande ?",
      options: ["DML", "DDL", "DCL", "TCL"],
      answer: "DDL",
      category: "DDL",
    },
    {
      question: "Dans une procédure stockée, que signifie le paramètre OUT ?",
      options: [
        "Paramètre en entrée",
        "Paramètre en sortie",
        "Paramètre optionnel",
        "Paramètre de sortie d'erreur",
      ],
      answer: "Paramètre en sortie",
      category: "PROCEDURES",
    },
  ];

  // Exercices pratiques
  const exercises = [
    {
      id: 1,
      title: "Créer une table simple",
      category: "DDL",
      difficulty: "Facile",
      description:
        'Créez une table "etudiants" avec les colonnes : id (INT, clé primaire), nom (VARCHAR 100), age (INT)',
      hint: "Utilisez CREATE TABLE avec PRIMARY KEY",
      solution: `CREATE TABLE etudiants (
  id INT PRIMARY KEY,
  nom VARCHAR(100),
  age INT
);`,
      xp: 10,
    },
    {
      id: 2,
      title: "Insérer des données",
      category: "DML",
      difficulty: "Facile",
      description:
        'Insérez un étudiant nommé "Amadou" âgé de 22 ans dans la table etudiants',
      hint: "Utilisez INSERT INTO ... VALUES",
      solution: `INSERT INTO etudiants (nom, age) 
VALUES ('Amadou', 22);`,
      xp: 10,
    },
    {
      id: 3,
      title: "Sélectionner avec condition",
      category: "DML",
      difficulty: "Facile",
      description: "Sélectionnez tous les étudiants âgés de plus de 20 ans",
      hint: "Utilisez SELECT avec WHERE et >",
      solution: `SELECT * FROM etudiants 
WHERE age > 20;`,
      xp: 15,
    },
    {
      id: 4,
      title: "INNER JOIN basique",
      category: "Jointures",
      difficulty: "Moyen",
      description:
        'Joignez les tables "commandes" et "clients" pour afficher toutes les commandes avec le nom du client',
      hint: "Utilisez INNER JOIN ON",
      solution: `SELECT commandes.*, clients.nom
FROM commandes
INNER JOIN clients ON commandes.client_id = clients.id;`,
      xp: 20,
    },
    {
      id: 5,
      title: "LEFT JOIN pour trouver les orphelins",
      category: "Jointures",
      difficulty: "Moyen",
      description:
        "Trouvez tous les clients qui n'ont jamais passé de commande",
      hint: "Utilisez LEFT JOIN avec WHERE ... IS NULL",
      solution: `SELECT clients.*
FROM clients
LEFT JOIN commandes ON clients.id = commandes.client_id
WHERE commandes.id IS NULL;`,
      xp: 25,
    },
  ];

  // Badges disponibles
  const badges = [
    {
      id: "first_quiz",
      name: "Premier Quiz",
      icon: "🎯",
      requirement: "Terminer un quiz",
    },
    {
      id: "perfect_score",
      name: "Score Parfait",
      icon: "💯",
      requirement: "Obtenir 100% à un quiz",
    },
    {
      id: "five_exercises",
      name: "Practicien",
      icon: "💪",
      requirement: "Compléter 5 exercices",
    },
    {
      id: "level_5",
      name: "Expert SQL",
      icon: "🏆",
      requirement: "Atteindre le niveau 5",
    },
    {
      id: "all_concepts",
      name: "Érudit",
      icon: "📚",
      requirement: "Explorer tous les concepts",
    },
  ];

  const handleQuizAnswer = (answer) => {
    const isCorrect = answer === quizQuestions[currentQuestion].answer;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
      addXP(5);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      if (newScore === quizQuestions.length) {
        unlockBadge("perfect_score");
      }
      if (!userProgress.badges.includes("first_quiz")) {
        unlockBadge("first_quiz");
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizMode(false);
  };

  // Fonctions pour le système de progression
  const addXP = (points) => {
    const newXP = userProgress.xp + points;
    let newLevel = userProgress.level;
    const newUnlockedLevels = [...userProgress.unlockedLevels];

    // Calculer le nouveau niveau basé sur l'XP total
    for (let i = levels.length - 1; i >= 0; i--) {
      if (newXP >= levels[i].xpRequired) {
        newLevel = levels[i].id;
        if (!newUnlockedLevels.includes(levels[i].id)) {
          newUnlockedLevels.push(levels[i].id);
        }
        break;
      }
    }

    setUserProgress((prev) => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      unlockedLevels: newUnlockedLevels,
      totalScore: prev.totalScore + points,
    }));

    if (newLevel === 5 && !userProgress.badges.includes("level_5")) {
      unlockBadge("level_5");
    }
  };

  const unlockBadge = (badgeId) => {
    if (!userProgress.badges.includes(badgeId)) {
      setUserProgress((prev) => ({
        ...prev,
        badges: [...prev.badges, badgeId],
      }));
    }
  };

  // Fonction pour exécuter le code SQL (simulation)
  const executeSQL = () => {
    try {
      // Simulation simple d'exécution SQL
      if (sqlCode.trim().toUpperCase().startsWith("SELECT")) {
        setSqlResult({
          success: true,
          message: "Requête exécutée avec succès!",
          data: [
            { id: 1, nom: "Diop", email: "diop@email.com" },
            { id: 2, nom: "Sow", email: "sow@email.com" },
            { id: 3, nom: "Fall", email: "fall@email.com" },
          ],
        });
        addXP(5);
      } else if (sqlCode.trim().toUpperCase().startsWith("CREATE")) {
        setSqlResult({
          success: true,
          message: "Table créée avec succès!",
          data: null,
        });
        addXP(10);
      } else if (sqlCode.trim().toUpperCase().startsWith("INSERT")) {
        setSqlResult({
          success: true,
          message: "1 ligne insérée",
          data: null,
        });
        addXP(5);
      } else {
        setSqlResult({
          success: true,
          message: "Commande exécutée",
          data: null,
        });
        addXP(3);
      }
    } catch (error) {
      setSqlResult({
        success: false,
        message: "Erreur SQL: " + error.message,
        data: null,
      });
    }
  };

  // Vérifier la réponse d'un exercice
  const checkExercise = () => {
    const ex = exercises[currentExercise];
    const userAnswer = exerciseAnswer.trim().toUpperCase().replace(/\s+/g, " ");
    const correctAnswer = ex.solution.trim().toUpperCase().replace(/\s+/g, " ");

    const isCorrect = userAnswer.includes(correctAnswer.substring(0, 30));

    setExerciseResult({
      correct: isCorrect,
      message: isCorrect
        ? "🎉 Correct! Excellent travail!"
        : "❌ Pas tout à fait. Essayez encore!",
      solution: ex.solution,
    });

    if (isCorrect) {
      addXP(ex.xp);
      const completedCount = userProgress.completedLessons.length + 1;

      setUserProgress((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, ex.id],
      }));

      if (
        completedCount >= 5 &&
        !userProgress.badges.includes("five_exercises")
      ) {
        unlockBadge("five_exercises");
      }
    }
  };

  // Passer à l'exercice suivant
  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseAnswer("");
      setExerciseResult(null);
    }
  };

  if (quizMode && !showGeneralities) {
    if (showResult) {
      return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Résultat du Quiz</h2>
              <div className="text-6xl mb-4">
                {score >= 4 ? "🎉" : score >= 3 ? "👍" : "💪"}
              </div>
              <p className="text-2xl mb-6">
                Score: {score} / {quizQuestions.length}
              </p>
              <p className="text-gray-400 mb-8">
                {score >= 4
                  ? "Excellent ! Vous maîtrisez les jointures SQL !"
                  : score >= 3
                    ? "Bien joué ! Continuez à pratiquer."
                    : "Pas mal ! Révisez le guide et réessayez."}
              </p>
              <button
                onClick={resetQuiz}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              >
                Retour au guide
              </button>
            </div>
          </div>
        </div>
      );
    }

    const question = quizQuestions[currentQuestion];
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-gray-400">
              Question {currentQuestion + 1} / {quizQuestions.length}
            </span>
            <span className="text-green-500">Score: {score}</span>
          </div>

          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleQuizAnswer(option)}
                  className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left transition-colors"
                >
                  {joins[option].name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="mt-6 text-gray-400 hover:text-white"
          >
            ← Retour au guide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Code size={32} />
          SENSqL
        </h1>
        <p className="text-green-100 mt-2">
          Maîtrisez SQL avec des exemples visuels
        </p>

        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={() => {
              setShowGeneralities(false);
              setQuizMode(false);
              setGeneralQuizMode(false);
              setShowEditor(false);
              setShowExercises(false);
              setShowProgress(false);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              !showGeneralities &&
              !showEditor &&
              !showExercises &&
              !showProgress
                ? "bg-white text-green-700"
                : "bg-green-500 text-white hover:bg-green-400"
            }`}
          >
            🔗 Jointures
          </button>
          <button
            onClick={() => {
              setShowGeneralities(true);
              setQuizMode(false);
              setGeneralQuizMode(false);
              setShowEditor(false);
              setShowExercises(false);
              setShowProgress(false);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showGeneralities
                ? "bg-white text-green-700"
                : "bg-green-500 text-white hover:bg-green-400"
            }`}
          >
            📚 Généralités
          </button>
          <button
            onClick={() => {
              setShowEditor(true);
              setShowGeneralities(false);
              setShowExercises(false);
              setShowProgress(false);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showEditor
                ? "bg-white text-green-700"
                : "bg-green-500 text-white hover:bg-green-400"
            }`}
          >
            💻 Éditeur SQL
          </button>
          <button
            onClick={() => {
              setShowExercises(true);
              setShowGeneralities(false);
              setShowEditor(false);
              setShowProgress(false);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showExercises
                ? "bg-white text-green-700"
                : "bg-green-500 text-white hover:bg-green-400"
            }`}
          >
            ✍️ Exercices
          </button>
          <button
            onClick={() => {
              setShowProgress(true);
              setShowGeneralities(false);
              setShowEditor(false);
              setShowExercises(false);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              showProgress
                ? "bg-white text-green-700"
                : "bg-green-500 text-white hover:bg-green-400"
            }`}
          >
            🏆 Progression
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {showProgress ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Trophy size={32} className="text-yellow-400" />
              Votre Progression
            </h2>

            <ProgressBar
              userProgress={userProgress}
              badges={badges}
              levels={levels}
            />

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award size={24} className="text-yellow-400" />
                Tous les Badges
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {badges.map((badge) => {
                  const unlocked = userProgress.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 ${
                        unlocked
                          ? "bg-yellow-500/20 border-yellow-500"
                          : "bg-gray-700/50 border-gray-600 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{badge.icon}</span>
                        <div>
                          <h4 className="font-bold">{badge.name}</h4>
                          <p className="text-sm text-gray-400">
                            {badge.requirement}
                          </p>
                          {unlocked && (
                            <p className="text-xs text-green-400 mt-1">
                              ✓ Débloqué
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Leçons Complétées</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {exercises.map((ex) => {
                  const completed = userProgress.completedLessons.includes(
                    ex.id,
                  );
                  return (
                    <div
                      key={ex.id}
                      className={`p-3 rounded-lg text-center ${
                        completed ? "bg-green-600" : "bg-gray-700"
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {completed ? "✅" : "⏳"}
                      </div>
                      <p className="text-sm font-semibold">{ex.title}</p>
                      {completed && (
                        <p className="text-xs text-green-200 mt-1">
                          +{ex.xp} XP
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : showEditor ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Code size={32} />
              Éditeur SQL Interactif
            </h2>

            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-2">
                💡 <strong>Astuce:</strong> Écrivez vos requêtes SQL ici et
                exécutez-les pour voir le résultat!
              </p>
              <p className="text-sm text-gray-400">
                Tables disponibles: clients, commandes, produits
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Votre requête SQL:
                </label>
                <textarea
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  className="w-full bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[200px] border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Écrivez votre requête SQL ici..."
                />
              </div>

              <button
                onClick={executeSQL}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <Play size={20} />
                Exécuter
              </button>
            </div>

            {sqlResult && (
              <div
                className={`rounded-lg p-6 ${
                  sqlResult.success
                    ? "bg-green-900/30 border-2 border-green-500"
                    : "bg-red-900/30 border-2 border-red-500"
                }`}
              >
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  {sqlResult.success ? (
                    <CheckCircle className="text-green-400" />
                  ) : (
                    <XCircle className="text-red-400" />
                  )}
                  {sqlResult.message}
                </h3>

                {sqlResult.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-800">
                        <tr>
                          {Object.keys(sqlResult.data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 border border-gray-700"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.data.map((row, idx) => (
                          <tr key={idx} className="bg-gray-700/50">
                            {Object.values(row).map((val, i) => (
                              <td
                                key={i}
                                className="px-4 py-2 border border-gray-700"
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Exemples à essayer:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setSqlCode("SELECT * FROM clients WHERE pays = 'Sénégal';")
                  }
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left"
                >
                  <p className="font-semibold mb-1">Clients sénégalais</p>
                  <code className="text-xs text-green-400">
                    SELECT * FROM clients...
                  </code>
                </button>
                <button
                  onClick={() =>
                    setSqlCode(
                      "SELECT clients.nom, COUNT(commandes.id) as total\nFROM clients\nLEFT JOIN commandes ON clients.id = commandes.client_id\nGROUP BY clients.nom;",
                    )
                  }
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left"
                >
                  <p className="font-semibold mb-1">Compter les commandes</p>
                  <code className="text-xs text-green-400">
                    SELECT ... COUNT...
                  </code>
                </button>
              </div>
            </div>
          </div>
        ) : showExercises ? (
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Target size={32} className="text-blue-400" />
              Exercices Pratiques
            </h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">
                  Exercice {currentExercise + 1} / {exercises.length}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    exercises[currentExercise].difficulty === "Facile"
                      ? "bg-green-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {exercises[currentExercise].difficulty}
                </span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentExercise + 1) / exercises.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 px-3 py-1 rounded text-sm">
                  {exercises[currentExercise].category}
                </span>
                <span className="text-yellow-400 flex items-center gap-1">
                  <Zap size={16} />+{exercises[currentExercise].xp} XP
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {exercises[currentExercise].title}
              </h3>

              <p className="text-gray-300 mb-4">
                {exercises[currentExercise].description}
              </p>

              <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Indice:</strong> {exercises[currentExercise].hint}
                </p>
              </div>

              <label className="block text-sm font-semibold mb-2">
                Votre réponse:
              </label>
              <textarea
                value={exerciseAnswer}
                onChange={(e) => setExerciseAnswer(e.target.value)}
                className="w-full bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[150px] border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
                placeholder="Écrivez votre requête SQL ici..."
              />

              <div className="flex gap-3">
                <button
                  onClick={checkExercise}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  Vérifier
                </button>

                {exerciseResult?.correct &&
                  currentExercise < exercises.length - 1 && (
                    <button
                      onClick={nextExercise}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
                    >
                      Exercice suivant →
                    </button>
                  )}
              </div>
            </div>

            {exerciseResult && (
              <div
                className={`rounded-lg p-6 ${
                  exerciseResult.correct
                    ? "bg-green-900/30 border-2 border-green-500"
                    : "bg-orange-900/30 border-2 border-orange-500"
                }`}
              >
                <p className="font-bold text-lg mb-3">
                  {exerciseResult.message}
                </p>

                {!exerciseResult.correct && (
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Solution:</p>
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                      <code className="text-green-400 text-sm">
                        {exerciseResult.solution}
                      </code>
                    </pre>
                  </div>
                )}

                {exerciseResult.correct && (
                  <p className="text-green-300">
                    Vous avez gagné {exercises[currentExercise].xp} XP! 🎉
                  </p>
                )}
              </div>
            )}
          </div>
        ) : showGeneralities ? (
          generalQuizMode ? (
            generalShowResult ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Résultat du Quiz SQL
                </h2>
                <div className="text-6xl mb-4">
                  {generalScore >= 8
                    ? "🏆"
                    : generalScore >= 6
                      ? "🎉"
                      : generalScore >= 4
                        ? "👍"
                        : "💪"}
                </div>
                <p className="text-2xl mb-6">
                  Score: {generalScore} / {generalQuizQuestions.length}
                </p>
                <p className="text-gray-400 mb-8">
                  {generalScore >= 8
                    ? "Excellent ! Vous maîtrisez parfaitement SQL !"
                    : generalScore >= 6
                      ? "Très bien ! Vous avez de bonnes bases."
                      : generalScore >= 4
                        ? "Pas mal ! Continuez à apprendre."
                        : "Révisez les concepts et réessayez !"}
                </p>
                <button
                  onClick={() => {
                    setGeneralQuizMode(false);
                    setGeneralShowResult(false);
                    setGeneralCurrentQuestion(0);
                    setGeneralScore(0);
                  }}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
                >
                  Retour aux concepts
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <span className="text-gray-400">
                    Question {generalCurrentQuestion + 1} /{" "}
                    {generalQuizQuestions.length}
                  </span>
                  <span className="text-green-500">Score: {generalScore}</span>
                </div>

                <div className="bg-gray-800 rounded-lg p-8">
                  <div className="mb-4">
                    <span className="bg-green-600 text-xs px-3 py-1 rounded-full">
                      {generalQuizQuestions[generalCurrentQuestion].category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-6">
                    {generalQuizQuestions[generalCurrentQuestion].question}
                  </h2>
                  <div className="space-y-3">
                    {generalQuizQuestions[generalCurrentQuestion].options.map(
                      (option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (
                              option ===
                              generalQuizQuestions[generalCurrentQuestion]
                                .answer
                            ) {
                              setGeneralScore(generalScore + 1);
                              addXP(10);
                            }

                            if (
                              generalCurrentQuestion <
                              generalQuizQuestions.length - 1
                            ) {
                              setGeneralCurrentQuestion(
                                generalCurrentQuestion + 1,
                              );
                            } else {
                              setGeneralShowResult(true);
                            }
                          }}
                          className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left transition-colors"
                        >
                          {option}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setGeneralQuizMode(false);
                    setGeneralCurrentQuestion(0);
                    setGeneralScore(0);
                  }}
                  className="mt-6 text-gray-400 hover:text-white"
                >
                  ← Retour aux concepts
                </button>
              </div>
            )
          ) : selectedConcept ? (
            <div>
              <button
                onClick={() => setSelectedConcept(null)}
                className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
              >
                ← Retour aux concepts
              </button>

              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-bold mb-4 text-green-400">
                  {generalConcepts[selectedConcept].name}
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  {generalConcepts[selectedConcept].description}
                </p>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Commandes principales :
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {generalConcepts[selectedConcept].commands.map(
                      (cmd, idx) => (
                        <span
                          key={idx}
                          className="bg-green-600 px-4 py-2 rounded-lg font-mono text-sm"
                        >
                          {cmd}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">📖 Exemples</h3>
              <div className="space-y-4 mb-6">
                {generalConcepts[selectedConcept].examples.map(
                  (example, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-3 text-green-400">
                        {example.title}
                      </h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <code className="text-green-400 text-sm">
                          {example.code}
                        </code>
                      </pre>
                    </div>
                  ),
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  💡 Points clés à retenir
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {generalConcepts[selectedConcept].keyPoints.map(
                    (point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{point}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-6">
                📚 Concepts SQL Fondamentaux
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {Object.keys(generalConcepts).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedConcept(key)}
                    className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg text-left transition-all transform hover:scale-105"
                  >
                    <h3 className="text-xl font-bold mb-2 text-green-400">
                      {generalConcepts[key].name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {generalConcepts[key].description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {generalConcepts[key].commands
                        .slice(0, 3)
                        .map((cmd, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-700 px-2 py-1 rounded text-xs font-mono text-green-300"
                          >
                            {cmd}
                          </span>
                        ))}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold mb-3">
                  Testez vos connaissances !
                </h2>
                <p className="mb-4">Quiz sur tous les concepts SQL</p>
                <button
                  onClick={() => setGeneralQuizMode(true)}
                  className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Commencer le Quiz SQL
                </button>
              </div>
            </div>
          )
        ) : (
          <>
            <div className="mb-6 flex gap-3 flex-wrap">
              {Object.keys(joins).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedJoin(key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedJoin === key
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {joins[key].name}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen size={24} />
                  Description
                </h2>
                <p className="text-gray-300 mb-4">
                  {joins[selectedJoin].description}
                </p>

                <h3 className="font-semibold mb-2 text-green-400">
                  Exemple d'utilisation:
                </h3>
                <p className="text-gray-400 italic">
                  {joins[selectedJoin].example}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Diagramme de Venn</h2>
                <div className="bg-gray-900 rounded-lg p-4">
                  <VennDiagram type={joins[selectedJoin].diagram} />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  La zone verte représente les données retournées
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code size={24} />
                Requête SQL
              </h2>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
                  {joins[selectedJoin].sql}
                </code>
              </pre>
            </div>

            <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Testez vos connaissances !
              </h2>
              <p className="mb-4">
                Répondez à 5 questions pour valider votre compréhension
              </p>
              <button
                onClick={() => setQuizMode(true)}
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Commencer le Quiz
              </button>
            </div>

            <div className="mt-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">
                💡 Astuces pour ne plus faire d'erreurs
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  • <strong>INNER JOIN</strong> : Seulement les correspondances
                  = intersection
                </li>
                <li>
                  • <strong>LEFT JOIN</strong> : Tout à gauche + correspondances
                  à droite
                </li>
                <li>
                  • <strong>RIGHT JOIN</strong> : Tout à droite +
                  correspondances à gauche
                </li>
                <li>
                  • <strong>FULL JOIN</strong> : Tout le monde, avec ou sans
                  correspondance
                </li>
                <li>
                  • Ajoutez <strong>WHERE X.key IS NULL</strong> pour exclure
                  les correspondances
                </li>
              </ul>
            </div>
          </>
        )}

        <div className="mt-8 bg-gray-800 border-t border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">
            Créé par{" "}
            <span className="text-green-500 font-semibold">
              Alioune Badara Diop
            </span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2026 SENSqL - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
};

export default SQLJoinsApp;
