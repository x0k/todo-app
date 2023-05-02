import { sample } from 'effector'

import { app, errorOccurred, started } from '@/shared/app'
import { r } from '@/shared/registry'

import './registry'
import {
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
  type TasksState,
  reducer,
} from './types'

export const todo = app.createDomain('todo')

// Stores

export const $tasksState = todo.createStore<TasksState>({
  lists: new Map(),
  tasks: new Map(),
  events: [],
})

export const $listsMap = $tasksState.map((state) => state.lists)

export const $lists = $listsMap.map(
  (map) => Object.fromEntries(map) as Record<TasksListId, TasksList>
)

export const $tasksMap = $tasksState.map((state) => state.tasks)

export const $tasks = $tasksMap.map(
  (map) => Object.fromEntries(map) as Record<TaskId, Task>
)

export const $events = $tasksState.map((state) => state.events)

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

export const completeTaskFx = todo.createEffect(
  r.todoService.completeTask
)

export const archiveTasksFx = todo.createEffect(
  r.todoService.archiveTasks
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
