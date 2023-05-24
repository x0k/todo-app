import { deleteDB } from 'idb'

import { BackendType, type IIDBService, type Workspace } from '@/shared/kernel'

import { type IWorkspaceBackendReleaseService } from '@/entities/workspace'

export class WorkspaceBackendReleaseService
  implements IWorkspaceBackendReleaseService
{
  constructor(private readonly idbService: IIDBService) {}

  release = async (ws: Workspace<BackendType>): Promise<void> => {
    switch (ws.backend.type) {
      case BackendType.IndexedDB: {
        await deleteDB(this.idbService.getDBName(ws.id))
        return
      }
      default: {
        const type: never = ws.backend.type
        throw new Error(`Unsupported backend type ${String(type)}`)
      }
    }
  }
}
