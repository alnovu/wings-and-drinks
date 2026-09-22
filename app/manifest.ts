import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wings and Drinks',
    short_name: 'Wings & Drinks',
    description: 'La mejor colección de juegos para fiestas',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x1280',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '1280x1280',
        type: 'image/png'
      }
    ]
  };
}
