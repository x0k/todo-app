import { chainRoute, redirect } from 'atomic-router'
import { sample } from 'effector'

import { app } from '@/shared/app'
import { type Workspace } from '@/shared/kernel'
import { routes } from '@/shared/routes'
import { type Loadable, type States } from '@/shared/state'

import { createWorkspaceFx, loadWorkspaceFx } from '@/entities/workspace/model'

const d = app.createDomain('workspace-page')

export const $currentWorkspace = d.createStore<
  States<Loadable<Workspace, Error>>
>({
  type: 'idle',
})

export const loadedWorkspaceViewRoute = chainRoute({
  route: routes.workspace.view,
  beforeOpen: {
    effect: loadWorkspaceFx,
    mapParams: ({ params }) => params.workspaceId,
  },
})

redirect({
  clock: loadWorkspaceFx.fail,
  route: routes.notFound,
})

$currentWorkspace
  .on(loadWorkspaceFx, () => ({ type: 'loading' }))
  .on(loadWorkspaceFx.finally, (_, params) =>
    params.status === 'done'
      ? { type: 'loaded', data: params.result }
      : { type: 'error', error: params.error }
  )

sample({
  clock: createWorkspaceFx.doneData,
  fn: (workspace) => ({ workspaceId: workspace.id }),
  target: routes.workspace.view.open,
})
