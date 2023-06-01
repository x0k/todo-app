import {
  type BackendType,
  type EncodedWorkspaceData,
  type IBackendManagerService,
  type Workspace,
} from '@/shared/kernel'

import { type IWorkspaceBackendService } from '@/entities/workspace'

export class WorkspaceBackendService implements IWorkspaceBackendService {
  constructor(
    private readonly backendManagers: {
      [T in BackendType]: IBackendManagerService<T>
    }
  ) {}

  import = async <T extends BackendType>(
    ws: Workspace<T>,
    data: EncodedWorkspaceData
  ): Promise<void> => {
    const backend = await this.backendManagers[ws.backend.type].resolve(ws)
    await backend.import(ws, data)
  }

  export = async <T extends BackendType>(
    ws: Workspace<T>
  ): Promise<EncodedWorkspaceData> => {
    const backend = await this.backendManagers[ws.backend.type].resolve(ws)
    return await backend.export(ws)
  }

  release = async <T extends BackendType>(ws: Workspace<T>): Promise<void> => {
    await this.backendManagers[ws.backend.type].release(ws)
  }
}
