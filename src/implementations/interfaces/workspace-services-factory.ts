import { type Workspace } from '@/shared/kernel'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import { type ITasksListService } from '@/entities/tasks-list'
import { type IToDoService } from '@/entities/todo'

export interface IWorkspaceServicesFactory {
  getTasksListService: (
    workspace: Workspace,
    params: WorkspaceTasksListRouteParams
  ) => Promise<ITasksListService>
  getToDoService: (workspace: Workspace) => Promise<IToDoService>
}
