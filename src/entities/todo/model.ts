import { sample } from 'effector'

import { app, errorOccurred, started } from '@/shared/app'
import { r } from '@/shared/registry'

import {
  type Task,
  TaskStatus,
  type TasksState,
  isPositiveEvent,
  reducer,
} from '@/models/todo'

export const todo = app.createDomain('todo')

// Stores

export const $tasksState = todo.createStore<TasksState>({
  lists: new Map(),
  tasks: new Map(),
  events: [],
})

export const $listsMap = $tasksState.map((state) => state.lists)

export const $tasksMap = $tasksState.map((state) => state.tasks)

export const $events = $tasksState.map((state) => state.events)

export const $date = todo.createStore(new Date())

export const $dashboard = $tasksState.map((state) => {
  const notDoneTasks: Task[] = []
  const doneTasks: Task[] = []
  for (const list of state.lists.values()) {
    const { tasks } = list
    if (
      list.isArchived ||
      list.tasksCount === 0 ||
      list.tasksCount === tasks[TaskStatus.Archived].size
    ) {
      continue
    }
    if (tasks[TaskStatus.Done].size > 0) {
      for (const taskId of tasks[TaskStatus.Done]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          doneTasks.push(task)
        }
      }
    } else {
      for (const taskId of tasks[TaskStatus.NotDone]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          notDoneTasks.push(task)
          break
        }
      }
    }
  }
  return {
    doneTasks,
    notDoneTasks,
    tasksLists: state.lists,
  }
})

export const $positiveEvents = $events.map((events) =>
  events.filter(isPositiveEvent)
)

// Events

export const doneTasksArchiving = todo.createEvent()

// Effects

export const loadTasksStateFx = todo.createEffect<void, TasksState>()

export const createTaskFx = todo.createEffect(r.todoService.createTask)

export const createTasksFx = todo.createEffect(r.todoService.createTasks)

export const createTasksListFx = todo.createEffect(
  r.todoService.createTasksList
)

export const updateTaskFx = todo.createEffect(r.todoService.updateTask)

export const updateTasksListFx = todo.createEffect(
  r.todoService.updateTasksList
)

export const changeTaskStatusFx = todo.createEffect(
  r.todoService.changeTaskStatus
)

export const changeTasksStatusFx = todo.createEffect(
  r.todoService.changeTasksStatus
)

// Init

sample({
  clock: started,
  target: loadTasksStateFx,
})

sample({
  clock: [
    loadTasksStateFx.failData,
    createTaskFx.failData,
    createTasksFx.failData,
    updateTaskFx.failData,
    createTasksListFx.failData,
    updateTasksListFx.failData,
    changeTaskStatusFx.failData,
    changeTasksStatusFx.failData,
  ],
  target: errorOccurred,
})

$tasksState
  .on(loadTasksStateFx.doneData, (_, payload) => payload)
  .on(
    [
      createTaskFx.doneData,
      createTasksFx.doneData,
      updateTaskFx.doneData,
      createTasksListFx.doneData,
      updateTasksListFx.doneData,
      changeTaskStatusFx.doneData,
      changeTasksStatusFx.doneData,
    ],
    reducer
  )

sample({
  clock: doneTasksArchiving,
  source: $dashboard,
  fn: ({ doneTasks }) => ({
    newStatus: TaskStatus.Archived,
    tasksIds: doneTasks.map((t) => t.id),
  }),
  target: changeTasksStatusFx,
})
