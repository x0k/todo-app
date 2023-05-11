import { attach, sample } from 'effector'

import { app, errorOccurred } from '@/shared/app'
import {
  type Event,
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'

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

const d = app.createDomain('todo')

// Stores

export const $todoService = d.createStore<IToDoService>({} as IToDoService)

export const $tasksState = d.createStore<TasksState>({
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

export const $events = d.createStore<Event[]>([])

// Effects

export const loadTasksStateFx = attach({
  source: $todoService,
  effect: async (s) => await s.loadTasksState(),
})

export const createTaskFx = attach({
  source: $todoService,
  effect: async (s, data: CreateTask) => await s.createTask(data),
})

export const createTasksFx = attach({
  source: $todoService,
  effect: async (s, data: CreateTasks) => await s.createTasks(data),
})

export const createTasksListFx = attach({
  source: $todoService,
  effect: async (s, data: CreateTasksList) => await s.createTasksList(data),
})

export const updateTaskFx = attach({
  source: $todoService,
  effect: async (s, data: UpdateTask) => await s.updateTask(data),
})

export const updateTasksListFx = attach({
  source: $todoService,
  effect: async (s, data: UpdateTasksList) => await s.updateTasksList(data),
})

export const completeTaskFx = attach({
  source: $todoService,
  effect: async (s, data: CompleteTask) => await s.completeTask(data),
})

export const archiveTasksFx = attach({
  source: $todoService,
  effect: async (s, data: ArchiveTasks) => await s.archiveTasks(data),
})

export const getEventsCountFx = attach({
  source: $todoService,
  effect: async (s) => await s.getEventsCount(),
})

export const loadEventsFx = attach({
  source: $todoService,
  effect: async (s, query: QueryEvents) => await s.loadEvents(query),
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
