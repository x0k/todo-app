import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'

import { Notifications } from '@/features/notifications'

import './index.css'
// Routes MUST be above router for proper effector init
import { Routes } from './routes'
import { Theme } from './theme'

export function App(): JSX.Element {
  return (
    <Theme>
      <CssBaseline />
      <Routes />
      <Notifications />
    </Theme>
  )
}
