import { Box, Typography } from '@mui/material'

import { ToggleTheme } from '@/features/toggle-theme'

export function HeaderWidget(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      pb={2}
    >
      <Typography variant="h4">DB name</Typography>
      <Box flexGrow={1} />
      <ToggleTheme />
    </Box>
  )
}
