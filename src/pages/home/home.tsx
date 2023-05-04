import { Box, Button, Paper, Typography } from '@mui/material'

import { WorkspacesList } from '@/features/workspaces-list'

import { HeaderWidget } from '@/widgets/header'

export function HomePage(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <HeaderWidget title={<Typography variant="h4">Workspaces</Typography>} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px)"
      >
        <Paper>
          <Box padding={2}>
            <WorkspacesList />
            <Button>Create workspace</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
