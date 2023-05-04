import { type Brand } from '@/shared/lib/type'

export type WorkspaceId = Brand<'WorkspaceId', string>

export interface Workspace {
  id: WorkspaceId
  title: string
}

export type WritableWorkspaceData = Partial<Pick<Workspace, 'title'>>

export interface CreateWorkspace {
  title: string
}

export interface UpdateWorkspace {
  id: WorkspaceId
  data: WritableWorkspaceData
}

export interface DeleteWorkspace {
  id: WorkspaceId
}

export interface IWorkspaceService {
  loadWorkspaces: () => Promise<Map<WorkspaceId, Workspace>>
  loadWorkspace: (id: WorkspaceId) => Promise<Workspace>
  createWorkspace: (data: CreateWorkspace) => Promise<Workspace>
  updateWorkspace: (data: UpdateWorkspace) => Promise<Workspace>
  deleteWorkspace: (data: DeleteWorkspace) => Promise<void>
}
