import { sample } from 'effector'

import { app, errorOccurred, started } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'
import { r } from '@/shared/registry'

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
  clock: started,
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

$workspacesMap.on(loadWorkspacesFx.doneData, (_, data) => data)
