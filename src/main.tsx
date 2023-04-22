import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { NotificationsContainer } from './features/notifications'
import './index.css'
import { init } from './init'

init()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <p>Hello world</p>
    <NotificationsContainer />
  </React.StrictMode>
)
