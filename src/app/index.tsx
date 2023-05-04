import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'

import { Notifications } from '@/features/notifications'

import './index.css'
import './init'
import { Providers } from './providers'
import { Routes } from './routes'

export default function App(): JSX.Element {
  return (
    <Providers>
      <CssBaseline />
      <Routes />
      <Notifications />
    </Providers>
  )
}
