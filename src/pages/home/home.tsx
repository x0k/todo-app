import { Box, Button, Paper, Typography } from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { Center } from '@/shared/components'

import {
  CreateWorkspaceDialog,
  createWorkspaceDialogModel,
} from '@/features/create-workspace-dialog'
import { WorkspacesList } from '@/features/workspaces-list'

import { HeaderWidget } from '@/widgets/header'

export function HomePage(): JSX.Element {
  const open = useUnit(createWorkspaceDialogModel.open)
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
            <Button onClick={open}>Create workspace</Button>
          </Box>
        </Paper>
      </Center>
      <CreateWorkspaceDialog />
    </Box>
  )
}
