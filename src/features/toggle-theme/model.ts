import { sr } from '@/shared/service-registry'

import { app } from '@/entities/app'

export enum Theme {
  Light = 'l',
  Dark = 'd',
}

export interface IThemeService {
  getTheme: () => Theme
  setTheme: (theme: Theme) => void
}

declare module '@/shared/service-registry' {
  interface ServiceRegistry {
    themeService: IThemeService
  }
}

const toggleTheme = app.createDomain('toggle-theme')

export const $theme = toggleTheme.createStore<Theme>(sr.themeService.getTheme())
