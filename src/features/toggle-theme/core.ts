export enum ColorMode {
  Light = 'l',
  Dark = 'd',
}

export interface IThemeService {
  getColorMode: () => ColorMode
  setColorMode: (colorMode: ColorMode) => void
}
