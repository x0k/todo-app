import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'

import { NotificationsContainer } from '@/features/notifications'
import { InMemoryToDoService } from '@/features/todo'

import { HomePage } from '@/pages/home'

import './index.css'
import { initApp } from './init'

export function App(): JSX.Element {
  initApp(new InMemoryToDoService())
  return (
    <>
      <CssBaseline />
      <HomePage />
      <NotificationsContainer />
    </>
  )
}