import { type EncodedWorkspaceData, type Workspace } from '@/shared/kernel'

export interface IWorkspaceIOService {
  export: (workspace: Workspace) => Promise<EncodedWorkspaceData>
  import: (workspace: Workspace, data: EncodedWorkspaceData) => Promise<void>
  drop: (workspace: Workspace) => Promise<void>
}
