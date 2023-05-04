import { createRoute } from 'atomic-router'

export interface WorkspaceRouteParams {
  workspaceId: string
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
