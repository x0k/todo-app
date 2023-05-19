import { type IRegistryService } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import {
  asyncWithCache,
  makeAsync,
  withCache,
  withMapCodec,
} from '@/shared/storage'

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

declare module '@/shared/app' {
  interface Config {
    themeService: void
    workspaceService: void
  }
}

export class RegistryService implements IRegistryService {
  workspaceService = async (): Promise<IWorkspaceService> =>
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

  themeService = async (): Promise<IThemeService> =>
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
}
