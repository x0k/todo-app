import react from '@vitejs/plugin-react-swc'
// import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
