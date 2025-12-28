import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Timosilo - Boutique Électronique',
    short_name: 'Timosilo',
    description: 'La meilleure boutique pour téléphones, ordinateurs et accessoires en Algérie',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpg',
      },
    ],
  }
}