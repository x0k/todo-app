import { createRoute } from 'atomic-router'

export interface WorkspaceRouteParams {
  workspaceId: string
}

export const workspaceViewPage = createRoute<WorkspaceRouteParams>()
