import { sample } from 'effector'

import { app, errorOccurred, appStarted } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import { r } from '@/shared/registry'

import './registry'

const d = app.createDomain('workspace')

// Stores

export const $workspacesMap = d.createStore(new Map<WorkspaceId, Workspace>())

export const $workspaces = $workspacesMap.map((map) => Array.from(map.values()))

// Events

// Effects

export const loadWorkspacesFx = d.createEffect(
  r.workspaceService.loadWorkspaces
)

export const loadWorkspaceFx = d.createEffect(r.workspaceService.loadWorkspace)

export const createWorkspaceFx = d.createEffect(
  r.workspaceService.createWorkspace
)

export const updateWorkspaceFx = d.createEffect(
  r.workspaceService.updateWorkspace
)

export const deleteWorkspaceFx = d.createEffect(
  r.workspaceService.deleteWorkspace
)

// Init

sample({
  clock: appStarted,
  target: loadWorkspacesFx,
})

sample({
  clock: [
    loadWorkspacesFx.failData,
    loadWorkspaceFx.failData,
    createWorkspaceFx.failData,
    updateWorkspaceFx.failData,
    deleteWorkspaceFx.failData,
  ],
  target: errorOccurred,
})

$workspacesMap
  .on(loadWorkspacesFx.doneData, (_, data) => data)
  .on(
    [
      loadWorkspaceFx.doneData,
      createWorkspaceFx.doneData,
      updateWorkspaceFx.doneData,
    ],
    (map, data) => {
      return new Map(map).set(data.id, data)
    }
  )

sample({
  clock: deleteWorkspaceFx.done,
  source: $workspacesMap,
  fn: (map, { params: { id } }) => {
    const newMap = new Map(map)
    return newMap.delete(id) ? newMap : map
  },
  target: $workspacesMap,
})
