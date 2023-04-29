import { defineService, singleton } from '@/shared/registry'

import { type ISyncStorage } from '@/models/storage'

import { ThemeService } from './theme-service'
import { type IThemeService, type Theme } from './types'

declare module '@/shared/registry' {
  interface Config {
    themeStorage: ISyncStorage<Theme>
  }
  interface Registry {
    themeService: IThemeService
  }
}

defineService(
  'themeService',
  singleton((c) => new ThemeService(c.themeStorage))
)
