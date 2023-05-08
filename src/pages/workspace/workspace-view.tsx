import { EventNote, FactCheck } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useUnit } from 'effector-react/scope'
import { useState } from 'react'

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
import { TasksListsList } from '@/features/tasks-lists-list'

import { HeaderWidget } from '@/widgets/header'

import { workspaceQuery } from './model'

interface ViewProps {
  workspace: Workspace
}

function View({ workspace }: ViewProps): JSX.Element {
  const [isEventsLogFeature, setIseEventsLogFeature] = useState(true)
  function toggleFeature(): void {
    setIseEventsLogFeature((s) => !s)
  }
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
          {isEventsLogFeature ? (
            <TitledPanel
              title={
                <>
                  <EventNote />
                  Events
                </>
              }
              actions={
                <IconButton onClick={toggleFeature}>
                  <FactCheck />
                </IconButton>
              }
            >
              <Box padding={2}>
                <PositiveEventsLog />
              </Box>
            </TitledPanel>
          ) : (
            <TitledPanel
              title={
                <>
                  <FactCheck />
                  Lists
                </>
              }
              actions={
                <IconButton onClick={toggleFeature}>
                  <EventNote />
                </IconButton>
              }
            >
              <TasksListsList onClick={console.log} />
            </TitledPanel>
          )}
        </Grid>
      </Grid>
      <CreateTasksPanel />
      <CompleteTaskDialog />
    </Box>
  )
}

export function WorkspaceViewPage(): JSX.Element {
  const { data, pending, error } = useUnit(workspaceQuery)
  const openHome = useUnit(routes.home.open)
  if (error instanceof Error && !pending) {
    return (
      <Center>
        <Typography>{error.message}</Typography>
        <Button onClick={openHome}>Back to home</Button>
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
