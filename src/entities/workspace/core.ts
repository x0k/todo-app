import {
  type BackendData,
  type BackendType,
  type Workspace,
  type WorkspaceId,
  type WritableWorkspaceData,
} from '@/shared/kernel'

export interface CreateWorkspace {
  title: string
  backend: BackendData<BackendType>
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

export interface IWorkspaceBackendReleaseService {
  release: (ws: Workspace) => Promise<void>
}
