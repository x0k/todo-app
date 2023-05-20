import { type IRegistryService } from '@/shared/app'
import { BackendType, type Workspace, type WorkspaceId } from '@/shared/kernel'
import { memoize } from '@/shared/lib/memoize-decorator'
import {
  type IAsyncStorageService,
  asyncWithCache,
  makeAsync,
  withCache,
  withMapCodec,
} from '@/shared/storage'

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
} from './storable-todo-sevice-state-codec'

declare module '@/shared/app' {
  interface Config {
    themeService: void
    workspaceService: void
    todoService: WorkspaceId
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
