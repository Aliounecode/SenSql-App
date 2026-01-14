import React, { useState } from "react";
import { BookOpen, Code, CheckCircle, XCircle } from "lucide-react";

const SQLJoinsApp = () => {
  const [selectedJoin, setSelectedJoin] = useState("INNER");
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

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

  const handleQuizAnswer = (answer) => {
    if (answer === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizMode(false);
  };

  if (quizMode) {
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
          Maîtrisez les Jointures SQL avec des exemples visuels
        </p>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
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
              • <strong>INNER JOIN</strong> : Seulement les correspondances =
              intersection
            </li>
            <li>
              • <strong>LEFT JOIN</strong> : Tout à gauche + correspondances à
              droite
            </li>
            <li>
              • <strong>RIGHT JOIN</strong> : Tout à droite + correspondances à
              gauche
            </li>
            <li>
              • <strong>FULL JOIN</strong> : Tout le monde, avec ou sans
              correspondance
            </li>
            <li>
              • Ajoutez <strong>WHERE X.key IS NULL</strong> pour exclure les
              correspondances
            </li>
          </ul>
        </div>
      </div>
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
  );
};

export default SQLJoinsApp;
