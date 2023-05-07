import { allSettled } from 'effector'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App, scope } from './app'
import { appStarted } from './shared/app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

allSettled(appStarted, { scope }).then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
