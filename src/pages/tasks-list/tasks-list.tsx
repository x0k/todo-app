import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useStore } from 'effector-react/scope'

import { Loader, TitledPanel } from '@/shared/components'
import { TaskStatus, type TasksList } from '@/shared/kernel'
import { routes } from '@/shared/routes'

import { TasksListContainer } from '@/entities/tasks-list'
import { TasksContainer } from '@/entities/tasks-list/containers/tasks'

import { ErrorMessage, ToWorkspace } from '@/widgets/error-message'
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
        title={<Typography variant="h4">{tasksList.title}</Typography>}
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
  const { workspaceId } = useStore(routes.workspace.tasksList.$params)
  return (
    <TasksListContainer
      render={{
        otherwise: () => <Loader />,
        error: ({ error }) => (
          <ErrorMessage
            message={error.message}
            action={<ToWorkspace workspaceId={workspaceId} />}
          />
        ),
        loaded: ({ data }) => <View tasksList={data} />,
      }}
    />
  )
}
