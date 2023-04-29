import { type IStorageService } from '@/models/storage'

import { type IThemeService, type ColorMode } from './types'

export class ThemeService implements IThemeService {
  constructor(private readonly storageService: IStorageService<ColorMode>) {}

  getColorMode = (): ColorMode => this.storageService.load()

  setColorMode = (theme: ColorMode): void => {
    this.storageService.save(theme)
  }
}
