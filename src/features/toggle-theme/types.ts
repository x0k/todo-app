export enum Theme {
  Light = 'l',
  Dark = 'd',
}

export interface IThemeService {
  getTheme: () => Theme
  setTheme: (theme: Theme) => void
}