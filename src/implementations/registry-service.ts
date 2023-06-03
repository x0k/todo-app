import { type IRegistryService } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
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

import { type IWorkspaceServicesFactory } from './interfaces/workspace-services-factory'
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
// export interface IBackendManagerService {
//   resolve: (workspace: Workspace) => Promise<IWorkspaceServicesFactory>
//   release: (workspace: Workspace) => Promise<void>
// }

// export interface IWorkspaceServicesFactory {
//   getTasksListService: (
//     params: WorkspaceTasksListRouteParams
//   ) => Promise<ITasksListService>
//   getToDoService: (workspaceId: WorkspaceId) => Promise<IToDoService>
//   export: (workspace: Workspace) => Promise<EncodedWorkspaceData>
//   import: (workspace: Workspace, data: EncodedWorkspaceData) => Promise<void>
// }

export class RegistryService implements IRegistryService {
  private readonly loadWorkspace = async (
    workspaceId: WorkspaceId
  ): Promise<Workspace> =>
    await (await this.workspaceService()).loadWorkspace(workspaceId)

  constructor(
    private readonly workspaceServicesFactory: IWorkspaceServicesFactory
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
      const workspace = await this.loadWorkspace(params.workspaceId)
      return await this.workspaceServicesFactory.getTasksListService(
        workspace,
        params
      )
    }
  )

  todoService = memoize(
    async (workspaceId: WorkspaceId): Promise<IToDoService> => {
      const workspace = await this.loadWorkspace(workspaceId)
      return await this.workspaceServicesFactory.getToDoService(workspace)
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
