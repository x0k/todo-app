import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { map, take } from '@/lib/iterable'

import { TitledPanel } from '@/components/titled-panel'

import {
  CreateTasksContainer,
  DashboardContainer,
  type Task,
  TaskContainer,
  type TaskId,
  TaskItem,
  TaskStatus,
  type TasksList,
  TasksListComponent,
  TasksListContainer,
  type TasksListId,
  TasksListsIdsContainer,
} from '@/features/todo'

function renderTask(task: Task): JSX.Element {
  return <TaskItem task={task} onClick={console.log} onEdit={console.log} />
}

function renderTasksList(tasksList: TasksList): JSX.Element {
  const tasks = tasksList.tasks[TaskStatus.NotDone]
  return (
    <TasksListComponent tasksList={tasksList}>
      {take(
        tasks.size,
        map(
          (taskId: TaskId) => (
            <TaskContainer key={taskId} taskId={taskId}>
              {renderTask}
            </TaskContainer>
          ),
          tasks
        )
      )}
    </TasksListComponent>
  )
}

function renderTasksLists(tasksListsIds: TasksListId[]): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
      {tasksListsIds.map((listId) => (
        <TasksListContainer key={listId} tasksListId={listId}>
          {renderTasksList}
        </TasksListContainer>
      ))}
    </Box>
  )
}

export function HomePage(): JSX.Element {
  return (
    <Box flex="1 1 100%" maxWidth="xl" marginX="auto" gap={2} padding={2}>
      <Grid container spacing={2}>
        <Grid xs>
          <DashboardContainer />
        </Grid>
        <Grid xs>
          <TitledPanel title="Create Tasks">
            <Box padding={2}>
              <CreateTasksContainer />
            </Box>
          </TitledPanel>
          <TasksListsIdsContainer>{renderTasksLists}</TasksListsIdsContainer>
        </Grid>
      </Grid>
    </Box>
  )
}
