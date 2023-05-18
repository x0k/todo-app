import { RouteParamsAndQuery } from 'atomic-router'
import { RouterProvider } from 'atomic-router-react/scope'
import { allSettled, fork, sample } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger'
import { Provider } from 'effector-react/scope'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app'
import {
  ITasksListService,
  InMemoryTasksListService,
  StorableTasksListService,
} from './entities/tasks-list'
import {
  IToDoService,
  InMemoryToDoService,
  StorableToDoService,
  StorableToDoServiceState,
} from './entities/todo'
import { StorableWorkspaceService } from './entities/workspace'
import { ColorMode, ThemeService } from './features/toggle-theme'
import { PersistentStorageService } from './implementations/persistent-storage'
import { makeStorableToDoServiceStateToTasksListServiceCodec } from './implementations/storable-todo-service-state-to-tasks-list-service-state-codec'
import {
  EncodedStorableToDoServiceState,
  withStorableToDoServiceStateCodec,
} from './implementations/storable-todo-sevice-state-codec'
import { $registry, type Registry, appStarted } from './shared/app'
import { BackendType, type Workspace, type WorkspaceId } from './shared/kernel'
import { noop } from './shared/lib/function'
import {
  WorkspaceRouteParams,
  WorkspaceTasksListRouteParams,
  router,
  routes,
} from './shared/router'
import {
  IAsyncStorageService,
  asyncWithCache,
  makeAsync,
  makeAsyncWithCodec,
  withCache,
  withMapCodec,
} from './shared/storage'

declare module '@/shared/app' {
  interface Registry {
    storableToDoServiceStateAsyncStorage: Promise<
      IAsyncStorageService<StorableToDoServiceState>
    >
  }
}

export const scope = fork({
  values: [
    [
      $registry,
      {
        todoService: new Promise(noop),
        tasksList: new Promise(noop),
        storableToDoServiceStateAsyncStorage: new Promise(noop),
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
        workspaceService: new StorableWorkspaceService(
          asyncWithCache(
            makeAsync(
              withMapCodec(
                new PersistentStorageService<Array<[WorkspaceId, Workspace]>>(
                  localStorage,
                  'workspaces',
                  []
                )
              )
            )
          )
        ),
        workspacePageSettingsStorage: new PersistentStorageService<boolean>(
          localStorage,
          'workspace-page-settings',
          false
        ),
      } satisfies Registry,
    ],
  ],
})

async function createTasksListService(
  r: Registry,
  e: RouteParamsAndQuery<WorkspaceTasksListRouteParams>
): Promise<ITasksListService> {
  const { lists, tasks } = await (await r.todoService).loadTasksState()
  const tasksList = lists.get(e.params.tasksListId)
  if (tasksList === undefined) {
    throw new Error(`Tasks list with "${e.params.tasksListId}" not found`)
  }
  const workspace = await r.workspaceService.loadWorkspace(e.params.workspaceId)
  switch (workspace.backend.type) {
    case BackendType.InMemory:
      return new InMemoryTasksListService(tasksList, tasks)
    case BackendType.LocalStorage:
      const withTasksListCodec = makeAsyncWithCodec(
        makeStorableToDoServiceStateToTasksListServiceCodec(
          e.params.tasksListId
        )
      )
      const storeWithCodec = withTasksListCodec(
        await r.storableToDoServiceStateAsyncStorage
      )
      const asyncStoreWithCache = asyncWithCache(storeWithCodec)
      return new StorableTasksListService(asyncStoreWithCache)
  }
}

$registry.on(routes.workspace.tasksList.opened, (r, e) => ({
  ...r,
  tasksList: createTasksListService(r, e),
}))

async function createStorableToDoServiceStateAsyncStorage(
  _: Registry,
  e: RouteParamsAndQuery<WorkspaceRouteParams>
): Promise<IAsyncStorageService<StorableToDoServiceState>> {
  const store = new PersistentStorageService<EncodedStorableToDoServiceState>(
    localStorage,
    `todo-${e.params.workspaceId}`,
    {
      events: [],
      lists: [],
      tasks: [],
    }
  )
  const storeWithCodec = withStorableToDoServiceStateCodec(store)
  return asyncWithCache(makeAsync(storeWithCodec))
}

async function createToDoService(
  r: Registry,
  e: RouteParamsAndQuery<WorkspaceRouteParams>
): Promise<IToDoService> {
  const workspace = await r.workspaceService.loadWorkspace(e.params.workspaceId)
  switch (workspace.backend.type) {
    case BackendType.InMemory:
      return new InMemoryToDoService(e.params.workspaceId)
    case BackendType.LocalStorage: {
      return new StorableToDoService(
        await r.storableToDoServiceStateAsyncStorage
      )
    }
  }
}

$registry.on(routes.workspace.index.opened, (r, e) => {
  const storableToDoServiceStateAsyncStorage =
    createStorableToDoServiceStateAsyncStorage(r, e)
  return {
    ...r,
    storableToDoServiceStateAsyncStorage,
    todoService: createToDoService(
      { ...r, storableToDoServiceStateAsyncStorage },
      e
    ),
  }
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
