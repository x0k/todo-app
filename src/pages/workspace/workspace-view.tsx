import { Box, Button, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useUnit } from 'effector-react/scope'

import { Center, TitledPanel } from '@/shared/components'
import { type Workspace } from '@/shared/kernel'
import { routes } from '@/shared/routes'

import {
  CompleteTaskDialog,
  completeTaskDialogModel,
} from '@/features/complete-task-dialog'
import { CreateTasksPanel } from '@/features/create-tasks-panel'
import { Dashboard } from '@/features/dashboard'
import { PositiveEventsLog } from '@/features/positive-events-log'

import { HeaderWidget } from '@/widgets/header'

import { workspaceQuery } from './model'

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
  // const workspace = useStore($currentWorkspace)
  const { data, pending, error } = useUnit(workspaceQuery)
  if (error instanceof Error && !pending) {
    return (
      <Center>
        <Typography>{error.message}</Typography>
        <Button
          onClick={() => {
            routes.home.open()
          }}
        >
          Back to home
        </Button>
      </Center>
    )
  }
  if (pending || data === null) {
    return (
      <Center>
        <CircularProgress size={64} />
      </Center>
    )
  }
  return <View workspace={data} />
}
