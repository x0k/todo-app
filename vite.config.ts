import react from '@vitejs/plugin-react-swc'
// import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import makeCert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/todo-app/',
  // server: { https: true },
  plugins: [
    // makeCert(),
    react({
      jsxImportSource: '@emotion/react',
      // babel: {
      //   plugins: [
      //     // Seems like this plugin is not working cause esbuild don`t have support for decorators
      //     [
      //       '@babel/plugin-proposal-decorators',
      //       { loose: true, version: '2022-03' },
      //     ],
      //     ['effector/babel-plugin', { addLoc: true }],
      //   ],
      //   presets: ['atomic-router/babel-preset'],
      // },
      tsDecorators: true,
      plugins: [
        [
          '@effector/swc-plugin',
          {
            factories: ['atomic-router'],
          },
        ],
      ],
    }),
    VitePWA({
      manifest: {
        name: 'TODO App',
        short_name: 'TODO App',
        description: 'Application for capture and track tasks and ideas',
        theme_color: '#ffffff',
        icons: [
          { src: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32' },
          { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
          {
            src: '/icon-192-maskable.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: '/icon-512-maskable.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
