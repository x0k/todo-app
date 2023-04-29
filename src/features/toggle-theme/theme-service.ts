import { type ISyncStorage } from '@/models/storage'

import { type IThemeService, type Theme } from './types'

export class ThemeService implements IThemeService {
  constructor(private readonly storageService: ISyncStorage<Theme>) {}

  getTheme = (): Theme => this.storageService.load()

  setTheme = (theme: Theme): void => {
    this.storageService.save(theme)
  }
}
