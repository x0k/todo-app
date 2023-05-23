import { type IDBPDatabase, openDB } from 'idb'

import { type IRegistryService } from '@/shared/app'
import { type IDBSchema, TARGET_IDB_SCHEMA_VERSION } from '@/shared/idb-schema'
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
import { IDBTasksListService } from '@/entities/tasks-list/services/idb-tasks-list-service'
import {
  type IToDoService,
  InMemoryToDoService,
  StorableToDoService,
  type StorableToDoServiceState,
} from '@/entities/todo'
import { IDBToDoService } from '@/entities/todo/services/idb-todo-service'
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

  private readonly indexedDb = memoize(
    async (workspaceId: WorkspaceId): Promise<IDBPDatabase<IDBSchema>> => {
      return await openDB<IDBSchema>(
        `todo-${workspaceId}`,
        TARGET_IDB_SCHEMA_VERSION,
        {
          async upgrade(db, oldVersion) {
            // Init
            if (oldVersion < 1) {
              db.createObjectStore('task', { keyPath: 'id' })
              db.createObjectStore('tasksList', { keyPath: 'id' })
              const events = db.createObjectStore('event', { keyPath: 'id' })
              events.createIndex('byCreatedAt', 'createdAt')
            }
          },
        }
      )
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
        case BackendType.IndexedDB: {
          return new IDBTasksListService(
            await this.indexedDb(workspaceId),
            tasksListId
          )
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
        case BackendType.IndexedDB: {
          return new IDBToDoService(await this.indexedDb(workspaceId))
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
