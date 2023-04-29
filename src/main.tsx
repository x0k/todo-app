import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import { defineConfig } from '@/shared/registry'

defineConfig({
  themeStorage: localStorage,
  themeStorageKey: 'theme',
  isDarkColorSchemePreferred: window.matchMedia('(prefers-color-scheme: dark)')
    .matches,
})

const App = React.lazy(async () => await import('./app'))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense>
      <App />
    </Suspense>
  </React.StrictMode>
)
