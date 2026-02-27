import type { MetadataRoute } from 'next'

      export default function manifest(): MetadataRoute.Manifest {
        return {
          name: 'Timosilo - Premium Electronics Store',
          short_name: 'Timosilo',
          description: 'Your trusted destination for smartphones, computers, and premium accessories in Algeria',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#000000',
          orientation: 'portrait-primary',
          scope: '/',
          icons: [
            {
              src: '/icon-dark-32x32.png',
              sizes: '32x32',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/logo.jpg',
              sizes: '192x192',
              type: 'image/jpeg',
              purpose: 'maskable',
            },
            {
              src: '/logo.jpg',
              sizes: '512x512',
              type: 'image/jpeg',
              purpose: 'any',
            },
          ],
          categories: ['shopping', 'business'],
          lang: 'fr-DZ',
        }
      }