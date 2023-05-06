import { Box, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useStore } from 'effector-react'

import { Center, TitledPanel } from '@/shared/components'
import { type Workspace } from '@/shared/kernel'

import {
  CompleteTaskDialog,
  completeTaskDialogModel,
} from '@/features/complete-task-dialog'
import { CreateTasksPanel } from '@/features/create-tasks-panel'
import { Dashboard } from '@/features/dashboard'
import { PositiveEventsLog } from '@/features/positive-events-log'

import { HeaderWidget } from '@/widgets/header'

import { $currentWorkspace } from './model'

interface ViewProps {
  workspace: Workspace
}

function View({ workspace }: ViewProps): JSX.Element {
  return (
    <Box
      flex="1 1 100%"
      maxWidth="xl"
      marginX="auto"
      gap={2}
      padding={2}
      marginBottom="72px"
    >
      <HeaderWidget
        title={<Typography variant="h4">{workspace.title}</Typography>}
      />
      <Grid container spacing={4}>
        <Grid xs>
          <Dashboard
            onUnDoneTaskClick={completeTaskDialogModel.open}
            onDoneTaskClick={console.log}
          />
        </Grid>
        <Grid xs>
          <TitledPanel title="Events">
            <Box padding={2}>
              <PositiveEventsLog />
            </Box>
          </TitledPanel>
        </Grid>
      </Grid>
      <CreateTasksPanel />
      <CompleteTaskDialog />
    </Box>
  )
}

export function WorkspaceViewPage(): JSX.Element {
  const workspace = useStore($currentWorkspace)
  switch (workspace.type) {
    case 'idle':
    case 'loading':
      return (
        <Center>
          <CircularProgress size={64} />
        </Center>
      )
    case 'error':
      return <Center>{workspace.error.message}</Center>
    case 'loaded':
      return <View workspace={workspace.data} />
  }
}
