import { openDB } from 'idb'

import { type IRegistryService } from '@/shared/app'
import {
  type IDB,
  type IDBSchema,
  TARGET_IDB_SCHEMA_VERSION,
} from '@/shared/idb-schema'
import {
  BackendType,
  type IIDBService,
  type Workspace,
  type WorkspaceId,
} from '@/shared/kernel'
import { memoize } from '@/shared/lib/memoize-decorator'
import {
  asyncWithCache,
  makeAsync,
  withCache,
  withMapCodec,
} from '@/shared/lib/storage'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import { type ITasksListService } from '@/entities/tasks-list'
import { IDBTasksListService } from '@/entities/tasks-list/services/idb-tasks-list-service'
import { type IToDoService } from '@/entities/todo'
import { IDBToDoService } from '@/entities/todo/services/idb-todo-service'
import {
  type IWorkspaceService,
  StorableWorkspaceService,
} from '@/entities/workspace'

import { type PersistentLocation } from '@/features/persist-location'
import {
  ColorMode,
  type IThemeService,
  ThemeService,
} from '@/features/toggle-theme'

import { PersistentStorageService } from './persistent-storage'
import { WorkspaceBackendService } from './workspace-backend-service'

declare module '@/shared/app' {
  interface Config {
    themeService: void
    indexedDb: WorkspaceId
    workspaceService: void
    workspacePageSettingsStorage: void
    todoService: WorkspaceId
    tasksListService: WorkspaceTasksListRouteParams
    locationStorage: void
  }
}

export class RegistryService implements IRegistryService {
  constructor(private readonly idbService: IIDBService) {}
  locationStorage = memoize(
    async () =>
      new PersistentStorageService<PersistentLocation>(
        localStorage,
        'last-location',
        {
          path: '/todo-app/',
          query: {},
        }
      )
  )

  indexedDb = memoize(async (workspaceId: WorkspaceId): Promise<IDB> => {
    return await openDB<IDBSchema>(
      this.idbService.getDBName(workspaceId),
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
  })

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
      const workspace = await (
        await this.workspaceService()
      ).loadWorkspace(workspaceId)
      switch (workspace.backend.type) {
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
        ),
        new WorkspaceBackendService(this, this.idbService)
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
