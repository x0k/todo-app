import { type IStorageService } from '@/shared/storage'

import { type ColorMode, type IThemeService } from './core'

export class ThemeService implements IThemeService {
  constructor(private readonly storageService: IStorageService<ColorMode>) {}

  getColorMode = (): ColorMode => this.storageService.load()

  setColorMode = (theme: ColorMode): void => {
    this.storageService.save(theme)
  }
}
