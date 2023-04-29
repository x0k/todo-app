import { ThemeProvider } from '@mui/material'
import { useStore } from 'effector-react'

import { $colorMode, ColorMode } from '@/features/toggle-theme'

import { darkTheme, lightTheme } from './themes'

export interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  const colorMode = useStore($colorMode)
  return (
    <ThemeProvider
      theme={colorMode === ColorMode.Dark ? darkTheme : lightTheme}
    >
      {children}
    </ThemeProvider>
  )
}
