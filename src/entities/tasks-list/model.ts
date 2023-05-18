import { attach, sample } from 'effector'

import { $registry, app } from '@/shared/app'
import { type Loadable, type States, mapLoadable } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import { routes } from '@/shared/router'

import { type ITasksListService, type TasksListState } from './core'

export const tasksList = app.createDomain('tasks-list')

declare module '@/shared/app' {
  interface Registry {
    tasksList: Promise<ITasksListService>
  }
}

export const $tasksListState = tasksList.createStore<
  States<Loadable<TasksListState, Error>>
>({
  type: 'idle',
})

export const $tasksList = $tasksListState.map(
  mapLoadable((data) => data.tasksList)
)

// Events

// Effects

export const loadTasksListFx = attach({
  source: $registry,
  effect: async (r) => await (await r.tasksList).loadTasksList(),
})

// Init

sample({
  clock: routes.workspace.tasksList.opened,
  fn: ({ params }) => params.tasksListId,
  target: loadTasksListFx,
})

bindLoadable($tasksListState, loadTasksListFx)
