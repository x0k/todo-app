import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'

import { defineConfig } from '@/shared/registry'

import { PersistentSyncStorageService } from '@/implementations/persistent-sync-storage'

import { NotificationsContainer } from '@/features/notifications'
import { InMemoryToDoService } from '@/features/todo'
import { Theme } from '@/features/toggle-theme/types'

import { HomePage } from '@/pages/home'

import './index.css'
import { initApp } from './init'

defineConfig({
  themeStorage: new PersistentSyncStorageService<Theme>(
    localStorage,
    'theme',
    Theme.Light
  ),
})

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
