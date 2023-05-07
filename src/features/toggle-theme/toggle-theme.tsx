import { DarkMode, LightMode } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useStore } from 'effector-react/scope'

import { $colorMode, colorModeToggled } from './model'
import { ColorMode } from './core'

function toggle(): void {
  colorModeToggled()
}
export function ToggleTheme(): JSX.Element {
  const colorMode = useStore($colorMode)
  return (
    <IconButton onClick={toggle}>
      {colorMode === ColorMode.Light ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}
