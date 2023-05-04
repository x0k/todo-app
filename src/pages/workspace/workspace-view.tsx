import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { TitledPanel } from '@/shared/components'

import {
  CompleteTaskDialog,
  completeTaskDialogModel,
} from '@/features/complete-task-dialog'
import { CreateTasksPanel } from '@/features/create-tasks-panel'
import { Dashboard } from '@/features/dashboard'
import { PositiveEventsLog } from '@/features/positive-events-log'

import { HeaderWidget } from '@/widgets/header'

export function WorkspaceViewPage(): JSX.Element {
  return (
    <Box
      flex="1 1 100%"
      maxWidth="xl"
      marginX="auto"
      gap={2}
      padding={2}
      marginBottom="72px"
    >
      <HeaderWidget title={<Typography variant="h4">Workspace</Typography>} />
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
