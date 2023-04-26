import { Box } from '@mui/material'

import { map, take } from '@/lib/iterable'

import {
  CreateTasksForm,
  type Task,
  TaskContainer,
  type TaskId,
  TaskItem,
  TaskStatus,
  type TasksList,
  TasksListComponent,
  TasksListContainer,
  type TasksListId,
  TasksListsContainer,
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
    <>
      {tasksListsIds.map((listId) => (
        <TasksListContainer key={listId} tasksListId={listId}>
          {renderTasksList}
        </TasksListContainer>
      ))}
    </>
  )
}

function renderForm(tasksLists: TasksList[]): JSX.Element {
  return <CreateTasksForm tasksLists={tasksLists} onSubmit={console.log} />
}

export function HomePage(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TasksListsIdsContainer>{renderTasksLists}</TasksListsIdsContainer>
      <TasksListsContainer>{renderForm}</TasksListsContainer>
    </Box>
  )
}
