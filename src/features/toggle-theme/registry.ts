import { defineService, singleton } from '@/shared/registry'

import { PersistentStorageService } from '@/implementations/persistent-storage'

import { ThemeService } from './theme-service'
import { type IThemeService, ColorMode } from './types'

declare module '@/shared/registry' {
  interface Config {
    themeStorage: Storage
    themeStorageKey: string
    isDarkColorSchemePreferred: boolean
  }
  interface Registry {
    themeService: IThemeService
  }
}

defineService(
  'themeService',
  singleton(
    (c) =>
      new ThemeService(
        new PersistentStorageService<ColorMode>(
          c.themeStorage,
          c.themeStorageKey,
          c.isDarkColorSchemePreferred ? ColorMode.Dark : ColorMode.Light
        )
      )
  )
)
