import { app } from '@/shared/app'
import { r } from '@/shared/registry'

import './registry'
import { ColorMode } from './types'

const toggleTheme = app.createDomain('toggle-theme')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const $colorMode = toggleTheme.createStore<ColorMode>(
  r.themeService.getColorMode()
)

export const colorModeToggled = toggleTheme.createEvent()

$colorMode.on(colorModeToggled, (state) =>
  state === ColorMode.Dark ? ColorMode.Light : ColorMode.Dark
)

$colorMode.subscribe(r.themeService.setColorMode)
