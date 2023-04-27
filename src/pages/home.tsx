import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { map, take } from '@/lib/iterable'

import {
  CreateTasksContainer,
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
  return tasksListsIds.length > 0 ? (
    <Box display="flex" flexDirection="column" gap={2}>
      {tasksListsIds.map((listId) => (
        <TasksListContainer key={listId} tasksListId={listId}>
          {renderTasksList}
        </TasksListContainer>
      ))}
    </Box>
  ) : (
    <Typography variant="h4">No tasks lists</Typography>
  )
}

export function HomePage(): JSX.Element {
  return (
    <Box flex="1 1 100%" maxWidth="xl" marginX="auto" gap={2} padding={2}>
      <Grid container spacing={2}>
        <Grid xs>
          <TasksListsIdsContainer>{renderTasksLists}</TasksListsIdsContainer>
        </Grid>
        <Grid xs>
          <CreateTasksContainer />
        </Grid>
      </Grid>
    </Box>
  )
}
