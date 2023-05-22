import { createHistoryRouter, createRoute } from 'atomic-router'
import { merge } from 'effector'

import { type TasksListId, type WorkspaceId } from './kernel'

export interface WorkspaceRouteParams {
  workspaceId: WorkspaceId
}

export interface WorkspaceTasksListRouteParams extends WorkspaceRouteParams {
  tasksListId: TasksListId
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
  {
    path: '/ws/:workspaceId/list/:tasksListId',
    route: routes.workspace.tasksList,
  },
]

export const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute: routes.notFound,
})

export const workspaceOpened = merge([
  routes.workspace.index.opened.map(
    ({ params: { workspaceId } }) => workspaceId
  ),
  routes.workspace.tasksList.opened.map(
    ({ params: { workspaceId } }) => workspaceId
  ),
])

export const tasksListOpened = routes.workspace.tasksList.opened.map(
  ({ params }) => params
)
