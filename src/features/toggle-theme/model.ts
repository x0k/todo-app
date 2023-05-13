import { attach, sample } from 'effector'

import { $registry, app, appStarted } from '@/shared/app'

import { ColorMode, type IThemeService } from './core'

const d = app.createDomain('toggle-theme')

declare module '@/shared/app' {
  interface Registry {
    themeService: IThemeService
  }
}

export const $colorMode = d.createStore(ColorMode.Light)

export const colorModeToggled = d.createEvent()

$colorMode.on(colorModeToggled, (state) =>
  state === ColorMode.Dark ? ColorMode.Light : ColorMode.Dark
)

const setColorModeFx = attach({
  source: $registry,
  effect: (r, colorMode: ColorMode) => {
    r.themeService.setColorMode(colorMode)
  },
})

sample({
  clock: appStarted,
  source: $registry,
  fn: (r) => r.themeService.getColorMode(),
  target: $colorMode,
})

sample({
  clock: $colorMode.updates,
  target: setColorModeFx,
})
