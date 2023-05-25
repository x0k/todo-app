import { deleteDB } from 'idb'

import { type IRegistryService } from '@/shared/app'
import {
  BackendType,
  type EncodedWorkspaceData,
  type IIDBService,
  type Workspace,
} from '@/shared/kernel'

import { type IWorkspaceBackendService } from '@/entities/workspace'

export class WorkspaceBackendService implements IWorkspaceBackendService {
  constructor(
    private readonly registryService: IRegistryService,
    private readonly idbService: IIDBService
  ) {}

  import = async (ws: Workspace, data: EncodedWorkspaceData): Promise<void> => {
    switch (ws.backend.type) {
      case BackendType.IndexedDB: {
        await this.idbService.importFromEncodedData(
          await this.registryService.indexedDb(ws.id),
          data
        )
        return
      }
      default: {
        const type: never = ws.backend.type
        throw new Error(`Unsupported backend type ${String(type)}`)
      }
    }
  }

  export = async (ws: Workspace): Promise<EncodedWorkspaceData> => {
    switch (ws.backend.type) {
      case BackendType.IndexedDB: {
        return await this.idbService.exportAsEncodedData(
          await this.registryService.indexedDb(ws.id)
        )
      }
      default: {
        const type: never = ws.backend.type
        throw new Error(`Unsupported backend type ${String(type)}`)
      }
    }
  }

  release = async (ws: Workspace): Promise<void> => {
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
