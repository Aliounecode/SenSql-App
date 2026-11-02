/** @type {import('tailwindcss').Config} */
const couleur = (nom) => `rgb(var(--${nom}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fond: couleur('fond'),
        surface: couleur('surface'),
        surface2: couleur('surface2'),
        bord: couleur('bord'),
        texte: couleur('texte'),
        doux: couleur('doux'),
        // A = table de gauche, B = table de droite, ok = ce que la jointure renvoie
        a: couleur('a'),
        b: couleur('b'),
        ok: couleur('ok'),
        surok: couleur('surok'),
        alerte: couleur('alerte'),
        erreur: couleur('erreur'),
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        code: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        carte: '0 1px 2px rgb(var(--ombre) / 0.06), 0 8px 24px -12px rgb(var(--ombre) / 0.18)',
        leve: '0 2px 4px rgb(var(--ombre) / 0.08), 0 16px 36px -14px rgb(var(--ombre) / 0.35)',
      },
      keyframes: {
        apparition: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        chatoiement: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        apparition: 'apparition 0.28s ease-out both',
        chatoiement: 'chatoiement 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
