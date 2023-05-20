import { attach, sample } from 'effector'

import { $registryService, app, appStarted } from '@/shared/app'

import { ColorMode, type IThemeService } from './core'

const d = app.createDomain('toggle-theme')

declare module '@/shared/app' {
  interface Registry {
    themeService: IThemeService
  }
}

export const $colorMode = d.createStore(ColorMode.Light)

export const colorModeToggled = d.createEvent()

const setColorModeFx = attach({
  source: $registryService,
  effect: async (r, colorMode: ColorMode) => {
    ;(await r.themeService()).setColorMode(colorMode)
  },
})

const getColorModeFx = attach({
  source: $registryService,
  effect: async (r) => (await r.themeService()).getColorMode(),
})

$colorMode
  .on(colorModeToggled, (state) =>
    state === ColorMode.Dark ? ColorMode.Light : ColorMode.Dark
  )
  .on(getColorModeFx.doneData, (_, colorMode) => colorMode)

sample({
  clock: appStarted,
  target: getColorModeFx,
})

sample({
  clock: $colorMode.updates,
  target: setColorModeFx,
})
