import { DarkMode, LightMode } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'

import { $colorMode, colorModeToggled } from './model'
import { ColorMode } from './core'

export function ToggleTheme(): JSX.Element {
  const colorMode = useStore($colorMode)
  const toggle = useUnit(colorModeToggled)
  return (
    <IconButton onClick={toggle}>
      {colorMode === ColorMode.Light ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}
