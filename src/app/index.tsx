import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { createHistoryRouter } from 'atomic-router'
// @ts-expect-error wtf
import { RouterProvider } from 'atomic-router-react/scope'
import { fork, sample } from 'effector'
import { Provider } from 'effector-react/scope'
import { createBrowserHistory } from 'history'

import { appStarted } from '@/shared/app'
import { notFoundRoute, routesMap } from '@/shared/routes'
import { withCache } from '@/shared/storage'

import { PersistentStorageService } from '@/implementations/persistent-storage'

import { Notifications } from '@/features/notifications'
import { $themeService, ColorMode, ThemeService } from '@/features/toggle-theme'

import './index.css'
// Routes MUST be above router for proper effector init
import { Routes } from './routes'
import { Theme } from './theme'

export const scope = fork({
  values: [
    [
      $themeService,
      new ThemeService(
        withCache(
          new PersistentStorageService<ColorMode>(
            localStorage,
            'theme',
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? ColorMode.Dark
              : ColorMode.Light
          )
        )
      ),
    ],
  ],
})

const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute,
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})

export function App(): JSX.Element {
  return (
    <Provider value={scope}>
      <RouterProvider router={router}>
        <Theme>
          <CssBaseline />
          <Routes />
          <Notifications />
        </Theme>
      </RouterProvider>
    </Provider>
  )
}
