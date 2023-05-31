import { type PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless'

import {
  type EncodedWorkspaceData,
  type IBackendService,
  type WorkspaceId,
} from '@/shared/kernel'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import { type ITasksListService } from '@/entities/tasks-list'
import { type IToDoService } from '@/entities/todo'

export class PlanetScaleBackendService implements IBackendService {
  constructor(private readonly db: PlanetScaleDatabase) {}
  getTasksListService: (
    params: WorkspaceTasksListRouteParams
  ) => Promise<ITasksListService>

  getToDoService: (workspaceId: WorkspaceId) => Promise<IToDoService>
  export: () => Promise<EncodedWorkspaceData>
  import: (data: EncodedWorkspaceData) => Promise<void>
}
