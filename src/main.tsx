import { createHistoryRouter } from 'atomic-router'
// @ts-expect-error wtf
import { RouterProvider } from 'atomic-router-react/scope'
import { allSettled, fork, sample } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger'
import { Provider } from 'effector-react/scope'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app'
import { TestTasksListService } from './entities/tasks-list'
import { $tasksListService } from './entities/tasks-list/model'
import { $tasksState, $todoService, TestToDoService } from './entities/todo'
import { TestWorkspaceService } from './entities/workspace'
import { $workspaceService } from './entities/workspace/model'
import { $themeService, ColorMode, ThemeService } from './features/toggle-theme'
import { PersistentStorageService } from './implementations/persistent-storage'
import { appStarted } from './shared/app'
import { notFoundRoute, routes, routesMap } from './shared/routes'
import { withCache } from './shared/storage'

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
    [$workspaceService, new TestWorkspaceService()],
    [$todoService, new TestToDoService()],
    [$tasksListService, new TestTasksListService(new Map(), new Map())],
  ],
})

sample({
  clock: routes.workspace.tasksList.opened,
  source: $tasksState,
  fn: ({ lists, tasks }) =>
    new TestTasksListService(new Map(lists), new Map(tasks)),
  target: $tasksListService,
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

attachLogger({ scope })

allSettled(appStarted, { scope }).then(() => {
  root.render(
    <React.StrictMode>
      <Provider value={scope}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </Provider>
    </React.StrictMode>
  )
})
