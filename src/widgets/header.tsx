import { Box } from '@mui/material'

import { ToggleTheme } from '@/features/toggle-theme'

export interface HeaderWidgetProps {
  title: React.ReactNode
  append?: React.ReactNode
}

export function HeaderWidget({
  title,
  append,
}: HeaderWidgetProps): JSX.Element {
  return (
    <Box display="flex" alignItems="center" width="100%" pb={2}>
      {title}
      <Box flexGrow={1} />
      <ToggleTheme />
      {append}
    </Box>
  )
}
