import { chainRoute } from 'atomic-router'
import { sample } from 'effector'

import { app } from '@/shared/app'
import { type Workspace } from '@/shared/kernel'
import { routes } from '@/shared/routes'

import { createWorkspaceFx, loadWorkspaceFx } from '@/entities/workspace/model'

const d = app.createDomain('workspace-page')

export const $currentWorkspace = d.createStore<Workspace | null>(null)

export const loadedWorkspaceViewRoute = chainRoute({
  route: routes.workspace.view,
  beforeOpen: {
    effect: loadWorkspaceFx,
    mapParams: ({ params }) => params.workspaceId,
  },
})

$currentWorkspace.on(loadWorkspaceFx.doneData, (_, workspace) => workspace)

sample({
  clock: createWorkspaceFx.doneData,
  fn: (workspace) => ({ workspaceId: workspace.id }),
  target: routes.workspace.view.open,
})
