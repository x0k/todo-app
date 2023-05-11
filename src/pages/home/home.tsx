import { Box, Button, Paper, Typography } from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { Center } from '@/shared/components'

import { WorkspacesContainer } from '@/entities/workspace'

import {
  CreateWorkspaceDialog,
  createWorkspaceDialogModel,
} from '@/entities/workspace/containers/create-workspace-dialog'

import { HeaderWidget } from '@/widgets/header'

export function HomePage(): JSX.Element {
  const open = useUnit(createWorkspaceDialogModel.dialogOpened)
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
            <WorkspacesContainer />
            <Button onClick={open}>Create workspace</Button>
          </Box>
        </Paper>
      </Center>
      <CreateWorkspaceDialog />
    </Box>
  )
}
