import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Archery Games',
        short_name: 'ArcheryGames',
        description: 'Giochi a tema arcieristico: Il giudice, Lettura del bersaglio, Il tuner, Piazzola 3D',
        lang: 'it',
        theme_color: '#1f3b2d',
        background_color: '#f4f1ea',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['piazzole/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/piazzole/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'piazzole', expiration: { maxEntries: 300, maxAgeSeconds: 60 * 24 * 3600 } },
          },
        ],
      },
    }),
  ],
});
