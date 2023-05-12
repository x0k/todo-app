import { attach, sample } from 'effector'

import { app } from '@/shared/app'
import { type TasksListId } from '@/shared/kernel'
import { type Loadable, type States, mapLoadable } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import { routes } from '@/shared/router'

import { type ITasksListService, type TasksListState } from './core'

export const tasksList = app.createDomain('tasks-list')

export const $tasksListService = tasksList.createStore<ITasksListService>(
  {} as ITasksListService
)

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
  source: $tasksListService,
  effect: async (s, id: TasksListId) => await s.loadTasksList(id),
})

// Init

sample({
  clock: routes.workspace.tasksList.opened,
  fn: ({ params }) => params.tasksListId,
  target: loadTasksListFx,
})

bindLoadable($tasksListState, loadTasksListFx)
