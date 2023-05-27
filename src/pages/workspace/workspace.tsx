import { FactCheck, Settings, ViewList } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useUnit } from 'effector-react/scope'

import { Loader, TitledPanel } from '@/shared/components'
import { type Workspace } from '@/shared/kernel'
import { routes } from '@/shared/router'

import {
  CompleteTaskDialogContainer,
  CreateTasksPanelContainer,
  DashboardContainer,
  PositiveEventsLog,
  TasksListsContainer,
  completeTaskDialogModel,
} from '@/entities/todo'
import {
  WorkspaceContainer,
  WorkspaceSettingsDialog,
  workspaceSettingsDialogModel,
} from '@/entities/workspace'

import { ErrorMessage } from '@/widgets/error-message'
import { HeaderWidget } from '@/widgets/header'

import { $isEventsLogFeature, featureToggled } from './model'

interface ViewProps {
  workspace: Workspace
}

function View({ workspace }: ViewProps): JSX.Element {
  const binds = useUnit({
    isEventsLogFeature: $isEventsLogFeature,
    toggleFeature: featureToggled,
    openTasksList: routes.workspace.tasksList.open,
    openCompleteTaskDialog: completeTaskDialogModel.dialogOpened,
    openWorkspaceSettingsDialog: workspaceSettingsDialogModel.dialogOpened,
  })
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
        append={
          <IconButton onClick={binds.openWorkspaceSettingsDialog}>
            <Settings />
          </IconButton>
        }
      />
      <Grid container spacing={4}>
        <Grid xs>
          <DashboardContainer
            onUnDoneTaskClick={binds.openCompleteTaskDialog}
            onDoneTaskClick={console.log}
          />
        </Grid>
        <Grid xs>
          {binds.isEventsLogFeature ? (
            <TitledPanel
              title={
                <>
                  <ViewList />
                  Events
                </>
              }
              actions={
                <IconButton onClick={binds.toggleFeature}>
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
                <IconButton onClick={binds.toggleFeature}>
                  <ViewList />
                </IconButton>
              }
            >
              <TasksListsContainer
                onClick={(tasksList) => {
                  void binds.openTasksList({
                    workspaceId: workspace.id,
                    tasksListId: tasksList.id,
                  })
                }}
              />
            </TitledPanel>
          )}
        </Grid>
      </Grid>
      <CreateTasksPanelContainer />
      <CompleteTaskDialogContainer />
      <WorkspaceSettingsDialog workspace={workspace} />
    </Box>
  )
}

export function WorkspacePage(): JSX.Element {
  return (
    <WorkspaceContainer
      render={{
        otherwise: () => <Loader />,
        error: ({ error }) => <ErrorMessage message={error.message} />,
        loaded: ({ data }) => <View workspace={data} />,
      }}
    />
  )
}
