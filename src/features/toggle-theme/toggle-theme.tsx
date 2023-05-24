import { DarkMode, LightMode } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'

import { ColorMode } from './core'
import { $colorMode, colorModeToggled } from './model'

export function ToggleTheme(): JSX.Element {
  const colorMode = useStore($colorMode)
  const toggle = useUnit(colorModeToggled)
  return (
    <IconButton onClick={toggle}>
      {colorMode === ColorMode.Light ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}
