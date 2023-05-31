import { type IRegistryService } from '@/shared/app'
import {
  type BackendType,
  type IBackendPoolService,
  type IBackendService,
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
import { type IToDoService } from '@/entities/todo'
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
    workspaceService: void
    workspacePageSettingsStorage: void
    todoService: WorkspaceId
    tasksListService: WorkspaceTasksListRouteParams
    locationStorage: void
  }
}

export class RegistryService implements IRegistryService {
  private readonly resolveBackend = async <T extends BackendType>(
    workspaceId: WorkspaceId
  ): Promise<IBackendService> => {
    // This call should be cached
    const workspace = await (
      await this.workspaceService()
    ).loadWorkspace<T>(workspaceId)
    const factory = this.backendPools[workspace.backend.type]
    // This call should return reused value from pull
    return await factory.resolve(workspace)
  }

  constructor(
    private readonly backendPools: {
      [T in BackendType]: IBackendPoolService<T>
    }
  ) {}

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

  workspacePageSettingsStorage = memoize(
    async () =>
      new PersistentStorageService<boolean>(
        localStorage,
        'workspace-page-settings',
        false
      )
  )

  tasksListService = memoize(
    async (
      params: WorkspaceTasksListRouteParams
    ): Promise<ITasksListService> => {
      const backend = await this.resolveBackend(params.workspaceId)
      return await backend.getTasksListService(params)
    }
  )

  todoService = memoize(
    async (workspaceId: WorkspaceId): Promise<IToDoService> => {
      const backend = await this.resolveBackend(workspaceId)
      return await backend.getToDoService(workspaceId)
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
        new WorkspaceBackendService(this.backendPools)
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
