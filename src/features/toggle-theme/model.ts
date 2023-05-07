import { sample } from 'effector'

import { app, appStarted } from '@/shared/app'

import { ColorMode, type IThemeService } from './core'

const d = app.createDomain('toggle-theme')

export const $themeService = d.createStore({} as IThemeService)

export const $colorMode = d.createStore(ColorMode.Light)

export const colorModeToggled = d.createEvent()

$colorMode.on(colorModeToggled, (state) =>
  state === ColorMode.Dark ? ColorMode.Light : ColorMode.Dark
)

const setColorModeFx = d.createEffect(
  ([themeService, colorMode]: [IThemeService, ColorMode]) => {
    themeService.setColorMode(colorMode)
  }
)

sample({
  clock: appStarted,
  source: $themeService,
  fn: (service) => service.getColorMode(),
  target: $colorMode,
})

sample({
  clock: $colorMode,
  source: $themeService,
  fn: (service, colorMode) => [service, colorMode] as const,
  target: setColorModeFx,
})
