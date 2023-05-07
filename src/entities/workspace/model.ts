import { sample } from 'effector'

import { app, appStarted, errorOccurred } from '@/shared/app'
import { type Workspace, type WorkspaceId } from '@/shared/kernel'

import {
  type CreateWorkspace,
  type DeleteWorkspace,
  type IWorkspaceService,
  type UpdateWorkspace,
} from './core'

const d = app.createDomain('workspace')

// Stores

export const $workspaceService = d.createStore<IWorkspaceService>(
  {} as IWorkspaceService
)

export const $workspacesMap = d.createStore(new Map<WorkspaceId, Workspace>())

export const $workspaces = $workspacesMap.map((map) => Array.from(map.values()))

// Events

// Effects

export const loadWorkspacesFx = d.createEffect<
  void,
  Map<WorkspaceId, Workspace>
>()

export const loadWorkspaceFx = d.createEffect<WorkspaceId, Workspace>()

export const createWorkspaceFx = d.createEffect<CreateWorkspace, Workspace>()

export const updateWorkspaceFx = d.createEffect<UpdateWorkspace, Workspace>()

export const deleteWorkspaceFx = d.createEffect<DeleteWorkspace, void>()

const updateFxHandlersFx = d.createEffect(
  (workspaceService: IWorkspaceService) => {
    loadWorkspaceFx.use(workspaceService.loadWorkspace)
    loadWorkspacesFx.use(workspaceService.loadWorkspaces)
    createWorkspaceFx.use(workspaceService.createWorkspace)
    updateWorkspaceFx.use(workspaceService.updateWorkspace)
    deleteWorkspaceFx.use(workspaceService.deleteWorkspace)
  }
)

// Init

sample({
  clock: [appStarted, $workspaceService.updates],
  source: $workspaceService,
  target: updateFxHandlersFx,
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
