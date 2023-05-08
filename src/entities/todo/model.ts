import { sample } from 'effector'

import { app, appStarted, errorOccurred } from '@/shared/app'
import {
  type Task,
  type TaskCompletedEvent,
  type TaskCreatedEvent,
  type TaskId,
  type TaskUpdatedEvent,
  type TasksArchivedEvent,
  type TasksCreatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
} from '@/shared/kernel'

import {
  type ArchiveTasks,
  type CompleteTask,
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  type IToDoService,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
  reducer,
} from './core'

const d = app.createDomain('todo')

// Stores

export const $todoService = d.createStore<IToDoService>({} as IToDoService)

export const $tasksState = d.createStore<TasksState>({
  lists: new Map(),
  tasks: new Map(),
  events: [],
})

export const $listsMap = $tasksState.map((state) => state.lists)

export const $listsRecord = $listsMap.map(
  (map) => Object.fromEntries(map) as Record<TasksListId, TasksList>
)

export const $listsArray = $tasksState.map((state) =>
  Array.from(state.lists.values())
)

export const $tasksMap = $tasksState.map((state) => state.tasks)

export const $tasksRecord = $tasksMap.map(
  (map) => Object.fromEntries(map) as Record<TaskId, Task>
)

export const $tasksArray = $tasksState.map((state) =>
  Array.from(state.tasks.values())
)

export const $events = $tasksState.map((state) => state.events)

// Effects

export const loadTasksStateFx = d.createEffect<void, TasksState>()

export const createTaskFx = d.createEffect<CreateTask, TaskCreatedEvent>()

export const createTasksFx = d.createEffect<CreateTasks, TasksCreatedEvent>()

export const createTasksListFx = d.createEffect<
  CreateTasksList,
  TasksListCreatedEvent
>()

export const updateTaskFx = d.createEffect<UpdateTask, TaskUpdatedEvent>()

export const updateTasksListFx = d.createEffect<
  UpdateTasksList,
  TasksListUpdatedEvent
>()

export const completeTaskFx = d.createEffect<CompleteTask, TaskCompletedEvent>()

export const archiveTasksFx = d.createEffect<ArchiveTasks, TasksArchivedEvent>()

const updateFxHandlersFx = d.createEffect((todoService: IToDoService) => {
  loadTasksStateFx.use(todoService.loadTasksState)
  createTaskFx.use(todoService.createTask)
  createTasksFx.use(todoService.createTasks)
  createTasksListFx.use(todoService.createTasksList)
  updateTaskFx.use(todoService.updateTask)
  updateTasksListFx.use(todoService.updateTasksList)
  completeTaskFx.use(todoService.completeTask)
  archiveTasksFx.use(todoService.archiveTasks)
})

// Events

// Init

sample({
  clock: [
    loadTasksStateFx.failData,
    createTaskFx.failData,
    createTasksFx.failData,
    updateTaskFx.failData,
    createTasksListFx.failData,
    updateTasksListFx.failData,
    completeTaskFx.failData,
    archiveTasksFx.failData,
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
      completeTaskFx.doneData,
      archiveTasksFx.doneData,
    ],
    reducer
  )

sample({
  clock: [appStarted, $todoService.updates],
  source: $todoService,
  target: updateFxHandlersFx,
})
