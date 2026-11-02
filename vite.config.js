import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // « prompt » : on affiche un bandeau « Nouvelle version disponible » plutôt que de recharger de force
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'SENSqL — Apprendre SQL',
        short_name: 'SENSqL',
        description:
          'Apprenez SQL par la pratique : jointures, DDL/DML, éditeur SQL réel, exercices corrigés et quiz.',
        lang: 'fr',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0e1a',
        theme_color: '#0a0e1a',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          { name: 'Éditeur SQL', short_name: 'Éditeur', url: '/#/editeur' },
          { name: 'Exercices', short_name: 'Exercices', url: '/#/exercices' },
          { name: 'Quiz des jointures', short_name: 'Quiz', url: '/#/quiz/jointures' },
        ],
      },
      workbox: {
        // Le moteur SQL (.wasm) et les polices sont mis en cache : l'appli fonctionne hors ligne
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,wasm}'],
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
