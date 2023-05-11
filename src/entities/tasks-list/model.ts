import { attach, sample } from 'effector'

import { app } from '@/shared/app'
import { type TasksList, type TasksListId } from '@/shared/kernel'
import { type Loadable, type States } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import { routes } from '@/shared/routes'

import { type ITasksListService } from './core'

const d = app.createDomain('tasks-list')

export const $tasksListService = d.createStore<ITasksListService>(
  {} as ITasksListService
)

export const $tasksList = d.createStore<States<Loadable<TasksList, Error>>>({
  type: 'idle',
})

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

bindLoadable($tasksList, loadTasksListFx)
