import { Box } from '@mui/material'

export interface CenterProps {
  topOffset?: string
  children: React.ReactNode
  gap?: number
}
export function Center({
  children,
  topOffset,
  gap = 2,
}: CenterProps): JSX.Element {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={topOffset ? `calc(100vh - 92px)` : '100vh'}
      gap={gap}
    >
      {children}
    </Box>
  )
}
