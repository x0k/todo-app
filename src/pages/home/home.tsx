import { Box, Button, Paper, Typography } from '@mui/material'

import { Center } from '@/shared/components'

import {
  CreateWorkspaceDialog,
  createWorkspaceDialogModel,
} from '@/features/create-workspace-dialog'
import { WorkspacesList } from '@/features/workspaces-list'

import { HeaderWidget } from '@/widgets/header'

function openDialog(): void {
  createWorkspaceDialogModel.open()
}

export function HomePage(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <HeaderWidget title={<Typography variant="h4">Workspaces</Typography>} />
      <Center topOffset="92px">
        <Paper>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            padding={2}
            minWidth="300px"
          >
            <WorkspacesList />
            <Button onClick={openDialog}>Create workspace</Button>
          </Box>
        </Paper>
      </Center>
      <CreateWorkspaceDialog />
    </Box>
  )
}
