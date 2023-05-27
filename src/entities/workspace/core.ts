import {
  type BackendData,
  type BackendType,
  type EncodedWorkspaceData,
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
  exportWorkspace: (id: WorkspaceId) => Promise<string>
  importWorkspace: (data: string) => Promise<Workspace>
}

export interface IWorkspaceBackendService {
  export: (ws: Workspace) => Promise<EncodedWorkspaceData>
  import: (ws: Workspace, data: EncodedWorkspaceData) => Promise<void>
  release: (ws: Workspace) => Promise<void>
}
