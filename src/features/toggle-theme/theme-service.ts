import { type IStorageService } from '@/shared/storage'

import { type IThemeService, type ColorMode } from './core'

export class ThemeService implements IThemeService {
  constructor(private readonly storageService: IStorageService<ColorMode>) {}

  getColorMode = (): ColorMode => this.storageService.load()

  setColorMode = (theme: ColorMode): void => {
    this.storageService.save(theme)
  }
}
