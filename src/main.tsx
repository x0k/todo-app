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
import { $tasksListService, TestTasksListService } from './entities/tasks-list'
import { $todoService, TestToDoService } from './entities/todo'
import { $workspaceService, TestWorkspaceService } from './entities/workspace'
import { $themeService, ColorMode, ThemeService } from './features/toggle-theme'
import { PersistentStorageService } from './implementations/persistent-storage'
import { appStarted } from './shared/app'
import { type TasksListId, type WorkspaceId } from './shared/kernel'
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
    [
      $workspaceService,
      new TestWorkspaceService([
        { title: 'Personal', id: 'personal' as WorkspaceId },
      ]),
    ],
    [$todoService, todoService],
    [$tasksListService, new TestTasksListService(todoService)],
  ],
})

sample({
  clock: routes.workspace.tasksList.opened,
  source: $todoService,
  fn: (todoService) => new TestTasksListService(todoService),
  target: $tasksListService,
})

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
