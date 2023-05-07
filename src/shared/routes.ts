import { createRoute } from 'atomic-router'

import { type WorkspaceId } from './kernel'

export interface WorkspaceRouteParams {
  workspaceId: WorkspaceId
}

export const routes = {
  home: createRoute(),
  workspace: {
    view: createRoute<WorkspaceRouteParams>(),
  },
  notFound: createRoute(),
}

export const routesMap = [
  { path: '/', route: routes.home },
  { path: '/ws/:workspaceId', route: routes.workspace.view },
]

export const notFoundRoute = routes.notFound
