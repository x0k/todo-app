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
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" gap={2} alignItems="center">
        <Typography variant="h6">{title}</Typography>
        <Box display="flex" flexGrow={1} />
        {actions}
      </Box>
      <Paper elevation={2}>{children}</Paper>
    </Box>
  )
}
