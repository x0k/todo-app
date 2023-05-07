// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        babelrc: true,
        plugins: [['effector/babel-plugin', { addLoc: true }]],
      },
      // plugins: [['@effector/swc-plugin', {}]],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
