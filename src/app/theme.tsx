import { ThemeProvider, createTheme } from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { $colorMode, ColorMode } from '@/features/toggle-theme'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

export interface ThemeProps {
  children: React.ReactNode
}

export function Theme({ children }: ThemeProps): JSX.Element {
  const colorMode = useUnit($colorMode)
  return (
    <ThemeProvider
      theme={colorMode === ColorMode.Dark ? darkTheme : lightTheme}
    >
      {children}
    </ThemeProvider>
  )
}
