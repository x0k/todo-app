import { allSettled } from 'effector'
import React from 'react'
import ReactDOM from 'react-dom/client'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger';

import { App, scope } from './app'
import { appStarted } from './shared/app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

attachLogger({ scope })

allSettled(appStarted, { scope }).then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
