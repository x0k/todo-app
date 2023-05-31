import {
  type BackendType,
  type EncodedWorkspaceData,
  type IBackendPoolService,
  type Workspace,
} from '@/shared/kernel'

import { type IWorkspaceBackendService } from '@/entities/workspace'

export class WorkspaceBackendService implements IWorkspaceBackendService {
  constructor(
    private readonly backendPools: {
      [T in BackendType]: IBackendPoolService<T>
    }
  ) {}

  import = async (ws: Workspace, data: EncodedWorkspaceData): Promise<void> => {
    const backend = await this.backendPools[ws.backend.type].resolve(ws)
    await backend.import(data)
  }

  export = async (ws: Workspace): Promise<EncodedWorkspaceData> => {
    const backend = await this.backendPools[ws.backend.type].resolve(ws)
    return await backend.export()
  }

  release = async (ws: Workspace): Promise<void> => {
    await this.backendPools[ws.backend.type].release(ws)
  }
}
