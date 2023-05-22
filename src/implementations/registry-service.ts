import { type IRegistryService } from '@/shared/app'
import { BackendType, type Workspace, type WorkspaceId } from '@/shared/kernel'
import { memoize } from '@/shared/lib/memoize-decorator'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'
import {
  type IAsyncStorageService,
  asyncWithCache,
  makeAsync,
  makeAsyncWithCodec,
  withCache,
  withMapCodec,
} from '@/shared/storage'

import {
  type ITasksListService,
  InMemoryTasksListService,
  StorableTasksListService,
} from '@/entities/tasks-list'
import {
  type IToDoService,
  InMemoryToDoService,
  StorableToDoService,
  type StorableToDoServiceState,
} from '@/entities/todo'
import {
  type IWorkspaceService,
  StorableWorkspaceService,
} from '@/entities/workspace'

import {
  ColorMode,
  type IThemeService,
  ThemeService,
} from '@/features/toggle-theme'

import { PersistentStorageService } from './persistent-storage'
import {
  type EncodedStorableToDoServiceState,
  withStorableToDoServiceStateCodec,
} from './storable-todo-service-state-codec'
import { makeStorableToDoServiceStateToTasksListServiceCodec } from './storable-todo-service-state-to-tasks-list-service-state-codec'

declare module '@/shared/app' {
  interface Config {
    themeService: void
    workspaceService: void
    workspacePageSettingsStorage: void
    todoService: WorkspaceId
    tasksListService: WorkspaceTasksListRouteParams
  }
}

export class RegistryService implements IRegistryService {
  private readonly storableToDoServiceStateAsyncStorage = memoize(
    async (
      workspaceId: WorkspaceId
    ): Promise<IAsyncStorageService<StorableToDoServiceState>> => {
      const store =
        new PersistentStorageService<EncodedStorableToDoServiceState>(
          localStorage,
          `todo-${workspaceId}`,
          {
            events: [],
            lists: [],
            tasks: [],
          }
        )
      const storeWithCodec = withStorableToDoServiceStateCodec(store)
      return asyncWithCache(makeAsync(storeWithCodec))
    }
  )
  
  workspacePageSettingsStorage = memoize(
    async () =>
      new PersistentStorageService<boolean>(
        localStorage,
        'workspace-page-settings',
        false
      )
  )

  tasksListService = memoize(
    async ({
      tasksListId,
      workspaceId,
    }: WorkspaceTasksListRouteParams): Promise<ITasksListService> => {
      const { lists, tasks } = await (
        await this.todoService(workspaceId)
      ).loadTasksState()
      const tasksList = lists.get(tasksListId)
      if (tasksList === undefined) {
        throw new Error(`Tasks list with "${tasksListId}" not found`)
      }
      const workspace = await (
        await this.workspaceService()
      ).loadWorkspace(workspaceId)
      switch (workspace.backend.type) {
        case BackendType.InMemory:
          return new InMemoryTasksListService(tasksList, tasks)
        case BackendType.LocalStorage: {
          const withTasksListCodec = makeAsyncWithCodec(
            makeStorableToDoServiceStateToTasksListServiceCodec(tasksListId)
          )
          const storeWithCodec = withTasksListCodec(
            await this.storableToDoServiceStateAsyncStorage(workspaceId)
          )
          const asyncStoreWithCache = asyncWithCache(storeWithCodec)
          return new StorableTasksListService(asyncStoreWithCache)
        }
      }
    }
  )

  todoService = memoize(
    async (workspaceId: WorkspaceId): Promise<IToDoService> => {
      const workspace = await (
        await this.workspaceService()
      ).loadWorkspace(workspaceId)
      switch (workspace.backend.type) {
        case BackendType.InMemory:
          return new InMemoryToDoService(workspaceId)
        case BackendType.LocalStorage: {
          return new StorableToDoService(
            await this.storableToDoServiceStateAsyncStorage(workspaceId)
          )
        }
      }
    }
  )

  workspaceService = memoize(
    async (): Promise<IWorkspaceService> =>
      new StorableWorkspaceService(
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
      )
  )

  themeService = memoize(
    async (): Promise<IThemeService> =>
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
      )
  )
}
