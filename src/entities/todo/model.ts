import { sample } from 'effector'

import { app, errorOccurred, started } from '@/shared/app'
import { r } from '@/shared/registry'

import './registry'
import { type TasksState, isPositiveEvent, reducer } from './types'

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

export const $positiveEvents = $events.map((events) =>
  events.filter(isPositiveEvent)
)

// Effects

export const loadTasksStateFx = todo.createEffect(r.todoService.loadTasksState)

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
