import { Box, Paper, Typography } from '@mui/material'
import { type ReactNode } from 'react'

export interface TitledPanelProps {
  title: ReactNode
  children: ReactNode
  actions?: ReactNode
}

export function TitledPanel({
  title,
  children,
  actions = null,
}: TitledPanelProps): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center">
        <Typography
          variant="h5"
          display="flex"
          alignItems="center"
          gap={1}
          gutterBottom
        >
          {title}
        </Typography>
        <Box display="flex" flexGrow={1} />
        {actions}
      </Box>
      <Paper elevation={2}>{children}</Paper>
    </Box>
  )
}
