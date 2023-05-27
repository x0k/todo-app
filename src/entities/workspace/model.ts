import { attach, sample } from 'effector'

import { $registryService, app } from '@/shared/app'
import { type IDB } from '@/shared/idb-schema'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import {
  JSON_MIME_TYPE,
  blobOpen,
  blobSave,
  makeJSONBlob,
} from '@/shared/lib/file'
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

declare module '@/shared/app' {
  interface Registry {
    indexedDb: IDB
    workspaceService: IWorkspaceService
  }
}

// Stores

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
  source: $registryService,
  effect: async (r) => await (await r.workspaceService()).loadWorkspaces(),
})

export const loadWorkspaceFx = attach({
  source: $registryService,
  effect: async (r, id: WorkspaceId) =>
    await (await r.workspaceService()).loadWorkspace(id),
})

export const createWorkspaceFx = attach({
  source: $registryService,
  effect: async (r, data: CreateWorkspace) =>
    await (await r.workspaceService()).createWorkspace(data),
})

export const updateWorkspaceFx = attach({
  source: $registryService,
  effect: async (r, data: UpdateWorkspace) =>
    await (await r.workspaceService()).updateWorkspace(data),
})

export const deleteWorkspaceFx = attach({
  source: $registryService,
  effect: async (r, data: DeleteWorkspace) => {
    await (await r.workspaceService()).deleteWorkspace(data)
  },
})

export const exportWorkspacesFx = attach({
  source: $registryService,
  effect: async (r, id: WorkspaceId) => {
    const data = await (await r.workspaceService()).exportWorkspace(id)
    await blobSave(`ws-${id}.json`, makeJSONBlob(data))
  },
})

export const importWorkspacesFx = attach({
  source: $registryService,
  effect: async (r) => {
    const data = await blobOpen([JSON_MIME_TYPE])
    await (await r.workspaceService()).importWorkspace(await data.text())
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
