import { attach, sample } from 'effector'

import { $registryService, app, errorOccurred } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import {
  JSON_FILE_EXTENSION,
  JSON_MIME_TYPE,
  blobOpen,
  blobSave,
  makeJSONBlob,
} from '@/shared/lib/file'
import { type Loadable, type States } from '@/shared/lib/state'
import { bindLoadable } from '@/shared/lib/state-effector'
import { routes, workspaceOpened } from '@/shared/router'

import {
  type CreateWorkspace,
  type DeleteWorkspace,
  type IWorkspaceService,
  type UpdateWorkspace,
} from './core'

export const workspace = app.createDomain('workspace')

declare module '@/shared/app' {
  interface Registry {
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

export const exportWorkspaceFx = attach({
  source: $registryService,
  effect: async (r, id: WorkspaceId) => {
    const data = await (await r.workspaceService()).exportWorkspace(id)
    await blobSave(`ws-${id}.json`, makeJSONBlob(data))
  },
})

export const importWorkspaceFx = attach({
  source: $registryService,
  effect: async (r) => {
    const data = await blobOpen({
      description: 'Workspace JSON file',
      extensions: [JSON_FILE_EXTENSION],
      mimeTypes: [JSON_MIME_TYPE],
    })
    return await (await r.workspaceService()).importWorkspace(await data.text())
  },
})

// Init
sample({
  clock: [
    loadWorkspacesFx.failData,
    loadWorkspaceFx.failData,
    createWorkspaceFx.failData,
    updateWorkspaceFx.failData,
    deleteWorkspaceFx.failData,
    exportWorkspaceFx.failData,
    importWorkspaceFx.failData,
  ],
  target: errorOccurred,
})

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
  clock: workspaceOpened,
  target: loadWorkspaceFx,
})

sample({
  clock: [createWorkspaceFx.doneData, importWorkspaceFx.doneData],
  fn: (workspace) => ({ workspaceId: workspace.id }),
  target: routes.workspace.index.open,
})
