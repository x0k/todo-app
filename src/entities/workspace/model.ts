import { sample } from 'effector'

import { app, errorOccurred, started } from '@/shared/app'
import { r } from '@/shared/registry'

import { type Workspace, type WorkspaceId } from './types'

const d = app.createDomain('workspace')

// Stores

export const $workspaces = d.createStore(new Map<WorkspaceId, Workspace>())

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

$workspaces.on(loadWorkspacesFx.doneData, (_, data) => data)
