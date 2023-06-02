import { attach, sample } from 'effector'

import { $registryService, app, errorOccurred } from '@/shared/app'
import { isDefined } from '@/shared/lib/guards'
import { type Loadable, type States, mapLoadable } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import {
  type WorkspaceTasksListRouteParams,
  tasksListOpened,
} from '@/shared/router'

import { type ITasksListService, type TasksListState } from './core'

export const tasksList = app.createDomain('tasks-list')

declare module '@/shared/app' {
  interface Registry {
    tasksListService: ITasksListService
  }
}

export const $currentTasksListParams =
  tasksList.createStore<WorkspaceTasksListRouteParams | null>(null)

export const $tasksListState = tasksList.createStore<
  States<Loadable<TasksListState, Error>>
>({
  type: 'idle',
})

export const $tasksList = $tasksListState.map(
  mapLoadable((data) => data.tasksList)
)

const $tasksListService = sample({
  source: {
    registry: $registryService,
    currentTasksListParams: $currentTasksListParams,
  },
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  fn: ({ registry, currentTasksListParams }): Promise<ITasksListService> =>
    currentTasksListParams === null
      ? Promise.reject(new Error('Tasks list params are not initialized'))
      : registry.tasksListService(currentTasksListParams),
})
// Events

// Effects

export const loadTasksListFx = attach({
  source: $tasksListService,
  effect: async (tasksListService) =>
    await (await tasksListService).loadTasksList(),
})

// Init

sample({
  clock: [loadTasksListFx.failData],
  target: errorOccurred,
})

sample({
  clock: tasksListOpened,
  target: $currentTasksListParams,
})

bindLoadable($tasksListState, loadTasksListFx)

sample({
  clock: $currentTasksListParams,
  filter: isDefined,
  target: loadTasksListFx,
})
