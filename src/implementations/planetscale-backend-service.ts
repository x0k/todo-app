import {
  type EncodedWorkspaceData,
  type IBackendService,
  type WorkspaceId,
} from '@/shared/kernel'
import { type PSDB } from '@/shared/planetscale-schema'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import {
  type ITasksListService,
  PlanetScaleTasksListService,
} from '@/entities/tasks-list'
import { type IToDoService } from '@/entities/todo'

export class PlanetScaleBackendService implements IBackendService {
  constructor(private readonly db: PSDB) {}
  getTasksListService = async (
    params: WorkspaceTasksListRouteParams
  ): Promise<ITasksListService> => {
    return new PlanetScaleTasksListService(this.db, params.tasksListId)
  }

  getToDoService = async (workspaceId: WorkspaceId): Promise<IToDoService> => {}
  export = async (): Promise<EncodedWorkspaceData> => {}
  import = async (data: EncodedWorkspaceData): Promise<void> => {}
}
