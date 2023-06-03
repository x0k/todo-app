import { type EncodedWorkspaceData, type Workspace } from '@/shared/kernel'

import { type IWorkspaceBackendService } from '@/entities/workspace'

import { type IWorkspaceIOService } from './interfaces/workspace-io-service'

export class WorkspaceBackendService implements IWorkspaceBackendService {
  constructor(private readonly workspaceIOService: IWorkspaceIOService) {}

  import = async (ws: Workspace, data: EncodedWorkspaceData): Promise<void> => {
    await backend.import(ws, data)
  }

  export = async (ws: Workspace): Promise<EncodedWorkspaceData> => {
    const backend = await this.backendManagers[ws.backend.type].resolve(ws)
    return await backend.export(ws)
  }

  release = async (ws: Workspace): Promise<void> => {
    await this.backendManagers[ws.backend.type].release(ws)
  }
}
