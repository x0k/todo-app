import { attach, sample } from 'effector'

import { $registry, app, errorOccurred } from '@/shared/app'
import {
  type Event,
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'
import { routes } from '@/shared/router'

import {
  type ArchiveTasks,
  type CompleteTask,
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  EVENTS_PER_PAGE,
  type IToDoService,
  type QueryEvents,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
  reducer,
} from './core'

export const todo = app.createDomain('todo')

declare module '@/shared/app' {
  interface Registry {
    todoService: IToDoService
  }
}

// Stores

export const $tasksState = todo.createStore<TasksState>({
  lists: new Map(),
  tasks: new Map(),
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

export const $events = todo.createStore<Event[]>([])

// Effects

export const loadTasksStateFx = attach({
  source: $registry,
  effect: async (r) => await r.todoService.loadTasksState(),
})

export const createTaskFx = attach({
  source: $registry,
  effect: async (r, data: CreateTask) => await r.todoService.createTask(data),
})

export const createTasksFx = attach({
  source: $registry,
  effect: async (r, data: CreateTasks) => await r.todoService.createTasks(data),
})

export const createTasksListFx = attach({
  source: $registry,
  effect: async (r, data: CreateTasksList) =>
    await r.todoService.createTasksList(data),
})

export const updateTaskFx = attach({
  source: $registry,
  effect: async (r, data: UpdateTask) => await r.todoService.updateTask(data),
})

export const updateTasksListFx = attach({
  source: $registry,
  effect: async (r, data: UpdateTasksList) =>
    await r.todoService.updateTasksList(data),
})

export const completeTaskFx = attach({
  source: $registry,
  effect: async (r, data: CompleteTask) =>
    await r.todoService.completeTask(data),
})

export const archiveTasksFx = attach({
  source: $registry,
  effect: async (r, data: ArchiveTasks) =>
    await r.todoService.archiveTasks(data),
})

export const getEventsCountFx = attach({
  source: $registry,
  effect: async (r) => await r.todoService.getEventsCount(),
})

export const loadEventsFx = attach({
  source: $registry,
  effect: async (r, query: QueryEvents) =>
    await r.todoService.loadEvents(query),
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

$events
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
    (events, event) => events.concat(event)
  )
  .on(loadEventsFx.done, (events, { params, result }) => {
    const start = (params.page - 1) * EVENTS_PER_PAGE
    return events
      .slice(0, start)
      .concat(result)
      .concat(events.slice(start + EVENTS_PER_PAGE))
  })

sample({
  clock: routes.workspace.index.opened,
  target: loadTasksStateFx,
})
