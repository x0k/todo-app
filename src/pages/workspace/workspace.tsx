import { FactCheck, ViewList } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useUnit } from 'effector-react/scope'
import { useState } from 'react'

import { Loader, TitledPanel } from '@/shared/components'
import { type Workspace } from '@/shared/kernel'
import { fold } from '@/shared/lib/state'
import { routes } from '@/shared/routes'

import { workspaceModel } from '@/entities/workspace'

import {
  CompleteTaskDialog,
  completeTaskDialogModel,
} from '@/features/complete-task-dialog'
import { CreateTasksPanel } from '@/features/create-tasks-panel'
import { Dashboard } from '@/features/dashboard'
import { PositiveEventsLog } from '@/features/positive-events-log'
import { TasksListsList } from '@/features/tasks-lists-list'

import { ErrorMessage } from '@/widgets/error-message'
import { HeaderWidget } from '@/widgets/header'

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
                  <ViewList />
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
                  <ViewList />
                </IconButton>
              }
            >
              <TasksListsList
                onClick={(tasksList) => {
                  routes.workspace.tasksList.open({
                    workspaceId: workspace.id,
                    tasksListId: tasksList.id,
                  })
                }}
              />
            </TitledPanel>
          )}
        </Grid>
      </Grid>
      <CreateTasksPanel />
      <CompleteTaskDialog />
    </Box>
  )
}

export function WorkspacePage(): JSX.Element {
  const ws = useUnit(workspaceModel.$workspace)
  return fold(ws, {
    otherwise: () => <Loader />,
    error: ({ error }) => <ErrorMessage message={error.message} />,
    loaded: ({ data }) => <View workspace={data} />,
  })
}
