import { createRoute } from 'atomic-router'

import { type WorkspaceId } from './kernel'

export interface WorkspaceRouteParams {
  workspaceId: WorkspaceId
}

export interface WorkspaceTasksListRouteParams extends WorkspaceRouteParams {
  tasksListId: string
}

export const routes = {
  home: createRoute(),
  workspace: {
    index: createRoute<WorkspaceRouteParams>(),
    tasksList: createRoute<WorkspaceTasksListRouteParams>(),
  },
  notFound: createRoute(),
}

export const routesMap = [
  { path: '/', route: routes.home },
  { path: '/ws/:workspaceId', route: routes.workspace.index },
  { path: '/ws/:workspaceId/list/:tasksListId', route: routes.workspace.tasksList }, 
]

export const notFoundRoute = routes.notFound
