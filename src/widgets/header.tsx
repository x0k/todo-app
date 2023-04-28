import { Box, Typography } from '@mui/material'

export function HeaderWidget(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      bgcolor="Background"
      pb={2}
    >
      <Typography variant="h4">DB name</Typography>
    </Box>
  )
}
