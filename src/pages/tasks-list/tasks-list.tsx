import { Home } from '@mui/icons-material'
import { Box, IconButton, Link as MLink, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Link } from 'atomic-router-react/scope'

import { Loader, Separator, TitledPanel } from '@/shared/components'
import { TaskStatus, type TasksList } from '@/shared/kernel'
import { type WorkspaceRouteParams, routes } from '@/shared/router'

import { TasksContainer, TasksListContainer } from '@/entities/tasks-list'
import { WorkspaceContainer } from '@/entities/workspace'

import { ErrorMessage } from '@/widgets/error-message'
import { HeaderWidget } from '@/widgets/header'

interface ViewProps {
  tasksList: TasksList
}

function View({ tasksList }: ViewProps): JSX.Element {
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
        title={
          <>
            <IconButton component={Link} to={routes.home}>
              <Home />
            </IconButton>
            <Separator />
            <WorkspaceContainer
              render={{
                otherwise: () => (
                  <Typography variant="h4" key="workspace">
                    Workspace
                  </Typography>
                ),
                loaded: ({ data }) => (
                  <MLink
                    color="inherit"
                    underline="none"
                    component={Link<WorkspaceRouteParams>}
                    to={routes.workspace.index}
                    params={{ workspaceId: data.id }}
                  >
                    <Typography variant="h4" key="workspace">
                      {data.title}
                    </Typography>
                  </MLink>
                ),
              }}
            />
            <Separator />
            <Typography variant="h4">{tasksList.title}</Typography>
          </>
        }
      />
      <Grid spacing={2} container>
        <Grid xs>
          <TitledPanel title="To Do">
            <TasksContainer
              taskStatus={TaskStatus.NotDone}
              onClick={console.log}
            />
          </TitledPanel>
        </Grid>
        <Grid xs>
          <TitledPanel title="Done">
            <TasksContainer
              taskStatus={TaskStatus.Done}
              onClick={console.log}
            />
          </TitledPanel>
        </Grid>
        <Grid xs>
          <TitledPanel title="Archived">
            <TasksContainer
              taskStatus={TaskStatus.Archived}
              onClick={console.log}
            />
          </TitledPanel>
        </Grid>
      </Grid>
    </Box>
  )
}

export function TasksListPage(): JSX.Element {
  return (
    <TasksListContainer
      render={{
        otherwise: () => <Loader />,
        error: ({ error }) => <ErrorMessage message={error.message} />,
        loaded: ({ data }) => <View tasksList={data} />,
      }}
    />
  )
}
