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
import { TestToDoService } from './entities/todo'
import { TestWorkspaceService } from './entities/workspace'
import { ColorMode, ThemeService } from './features/toggle-theme'
import { PersistentStorageService } from './implementations/persistent-storage'
import { $registry, type Registry, appStarted } from './shared/app'
import {
  BackendType,
  type TasksListId,
  type WorkspaceId,
} from './shared/kernel'
import { router, routes } from './shared/router'
import { withCache } from './shared/storage'

const todoService = new TestToDoService([
  {
    id: 'list' as TasksListId,
    title: 'list',
    tasks: ['first', 'second'],
  },
])

export const scope = fork({
  values: [
    [
      $registry,
      {
        todoService,
        tasksList: new TestTasksListService(todoService),
        themeService: new ThemeService(
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
        workspaceService: new TestWorkspaceService([
          {
            title: 'Personal',
            id: 'personal' as WorkspaceId,
            backend: { type: BackendType.InMemory, config: {} },
          },
        ]),
        workspacePageSettingsStorage: new PersistentStorageService<boolean>(
          localStorage,
          'workspace-page-settings',
          false
        ),
      } satisfies Registry,
    ],
  ],
})

$registry.on(routes.workspace.tasksList.opened, (r) => ({
  ...r,
  tasksList: new TestTasksListService(r.todoService),
}))

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

attachLogger({ scope })

allSettled(appStarted, { scope })
  .then(() => {
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
  .catch(console.error)
