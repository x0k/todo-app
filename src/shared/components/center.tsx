import { Box } from '@mui/material'

export interface CenterProps {
  topOffset?: string
  children: React.ReactNode
}
export function Center({ children, topOffset: offset }: CenterProps): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={offset ? `calc(100vh - 92px)` : '100vh'}
    >
      {children}
    </Box>
  )
}
