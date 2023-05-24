import { attach, sample } from 'effector'

import { $registryService, app, errorOccurred } from '@/shared/app'
import {
  type Event,
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
  type WorkspaceId,
} from '@/shared/kernel'
import { isDefined } from '@/shared/lib/guards'
import { workspaceOpened } from '@/shared/router'

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

export const $currentWorkspaceId = todo.createStore<WorkspaceId | null>(null)

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

const $todoService = sample({
  source: {
    registryService: $registryService,
    workspaceId: $currentWorkspaceId,
  },
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  fn: ({ registryService, workspaceId }): Promise<IToDoService> =>
    workspaceId === null
      ? Promise.reject(new Error(`Workspace is not initialized`))
      : registryService.todoService(workspaceId),
})

// Effects

export const loadTasksStateFx = attach({
  source: $todoService,
  effect: async (todoService) => await (await todoService).loadTasksState(),
})

export const createTaskFx = attach({
  source: $todoService,
  effect: async (todoService, data: CreateTask) =>
    await (await todoService).createTask(data),
})

export const createTasksFx = attach({
  source: $todoService,
  effect: async (todoService, data: CreateTasks) =>
    await (await todoService).createTasks(data),
})

export const createTasksListFx = attach({
  source: $todoService,
  effect: async (todoService, data: CreateTasksList) =>
    await (await todoService).createTasksList(data),
})

export const updateTaskFx = attach({
  source: $todoService,
  effect: async (todoService, data: UpdateTask) =>
    await (await todoService).updateTask(data),
})

export const updateTasksListFx = attach({
  source: $todoService,
  effect: async (todoService, data: UpdateTasksList) =>
    await (await todoService).updateTasksList(data),
})

export const completeTaskFx = attach({
  source: $todoService,
  effect: async (todoService, data: CompleteTask) =>
    await (await todoService).completeTask(data),
})

export const archiveTasksFx = attach({
  source: $todoService,
  effect: async (todoService, data: ArchiveTasks) =>
    await (await todoService).archiveTasks(data),
})

export const getEventsCountFx = attach({
  source: $todoService,
  effect: async (todoService) => await (await todoService).getEventsCount(),
})

export const loadEventsFx = attach({
  source: $todoService,
  effect: async (todoService, query: QueryEvents) =>
    await (await todoService).loadEvents(query),
})

// Events

// Init
sample({
  clock: workspaceOpened,
  target: $currentWorkspaceId,
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
  clock: $currentWorkspaceId,
  filter: isDefined,
  target: loadTasksStateFx,
})
