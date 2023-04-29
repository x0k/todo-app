import { r } from '@/shared/registry'

import { app } from '@/entities/app'

import { type Theme } from './types'

const toggleTheme = app.createDomain('toggle-theme')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const theme$ = toggleTheme.createStore<Theme>(r.themeService.getTheme())
