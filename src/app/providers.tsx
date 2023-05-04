import { ThemeProvider } from '@mui/material'
// @ts-expect-error wtf
import { RouterProvider } from 'atomic-router-react'
import { useStore } from 'effector-react'

import { $colorMode, ColorMode } from '@/features/toggle-theme'

import { router } from './router'
import { darkTheme, lightTheme } from './themes'

export interface ProvidersProps {
  children: React.ReactNode
}

function Theme({ children }: ProvidersProps): JSX.Element {
  const colorMode = useStore($colorMode)
  return (
    <ThemeProvider
      theme={colorMode === ColorMode.Dark ? darkTheme : lightTheme}
    >
      {children}
    </ThemeProvider>
  )
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <RouterProvider router={router}>
      <Theme>{children}</Theme>
    </RouterProvider>
  )
}
