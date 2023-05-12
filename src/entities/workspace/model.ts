import { attach, sample } from 'effector'

import { app } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import { type Loadable, type States } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import { routes } from '@/shared/router'

import {
  type CreateWorkspace,
  type DeleteWorkspace,
  type IWorkspaceService,
  type UpdateWorkspace,
} from './core'

export const workspace = app.createDomain('workspace')

// Stores

export const $workspaceService = workspace.createStore<IWorkspaceService>(
  {} as IWorkspaceService
)

export const $workspacesMap = workspace.createStore(
  new Map<WorkspaceId, Workspace>()
)

export const $workspacesArray = $workspacesMap.map((map) =>
  Array.from(map.values())
)

export const $workspace = workspace.createStore<
  States<Loadable<Workspace, Error>>
>({
  type: 'idle',
})

// Effects

export const loadWorkspacesFx = attach({
  source: $workspaceService,
  effect: async (s) => await s.loadWorkspaces(),
})

export const loadWorkspaceFx = attach({
  source: $workspaceService,
  effect: async (s, id: WorkspaceId) => await s.loadWorkspace(id),
})

export const createWorkspaceFx = attach({
  source: $workspaceService,
  effect: async (s, data: CreateWorkspace) => await s.createWorkspace(data),
})

export const updateWorkspaceFx = attach({
  source: $workspaceService,
  effect: async (s, data: UpdateWorkspace) => await s.updateWorkspace(data),
})

export const deleteWorkspaceFx = attach({
  source: $workspaceService,
  effect: async (s, data: DeleteWorkspace) => {
    await s.deleteWorkspace(data)
  },
})

// Init

$workspacesMap
  .on(loadWorkspacesFx.doneData, (_, data) => data)
  .on(
    [
      createWorkspaceFx.doneData,
      loadWorkspaceFx.doneData,
      updateWorkspaceFx.doneData,
    ],
    (map, workspace) => new Map(map).set(workspace.id, workspace)
  )
  .on(deleteWorkspaceFx.done, (map, { params: { id } }) => {
    if (!map.has(id)) {
      return
    }
    const newMap = new Map(map)
    newMap.delete(id)
    return newMap
  })

bindLoadable($workspace, loadWorkspaceFx)
$workspace
  .on(
    [
      createWorkspaceFx.doneData,
      loadWorkspaceFx.doneData,
      updateWorkspaceFx.doneData,
    ],
    (_, data) => ({ type: 'loaded', data })
  )
  .on(deleteWorkspaceFx.done, () => ({ type: 'idle' }))

sample({
  clock: routes.home.opened,
  target: loadWorkspacesFx,
})

sample({
  clock: routes.workspace.index.opened,
  fn: ({ params }) => params.workspaceId,
  target: loadWorkspaceFx,
})

sample({
  clock: createWorkspaceFx.doneData,
  fn: (workspace) => ({ workspaceId: workspace.id }),
  target: routes.workspace.index.open,
})
