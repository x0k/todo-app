import { createQuery } from '@farfetched/core'
import { sample } from 'effector'

import { app } from '@/shared/app'
import { type TasksList } from '@/shared/kernel'
import { routes } from '@/shared/routes'
import { type Loadable, type States } from '@/shared/state'

import { $workspacesMap, loadWorkspaceFx } from '@/entities/workspace/model'

const d = app.createDomain('workspace/tasks-list')

export const workspaceQuery = createQuery({
  handler: loadWorkspaceFx,
})

export const $currentTasksList = d.createStore<
  States<Loadable<TasksList, Error>>
>({ type: 'idle' })

sample({
  clock: routes.workspace.tasksList.opened,
  source: $workspacesMap,
  filter: (workspaces, { params: { workspaceId } }) =>
    !workspaces.has(workspaceId),
  fn: (_, { params: { workspaceId } }) => workspaceId,
  target: workspaceQuery.start,
})

sample({
  clock: routes.workspace.tasksList.opened,
  source: $workspacesMap,
})
