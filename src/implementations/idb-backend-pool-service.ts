import { deleteDB, openDB } from 'idb'

import {
  type IDB,
  type IDBSchema,
  TARGET_IDB_SCHEMA_VERSION,
} from '@/shared/idb-schema'
import {
  type BackendType,
  type IBackendManagerService,
  type IBackendService,
  type Workspace,
  type WorkspaceId,
} from '@/shared/kernel'

import { IDBBackendService } from './idb-backend-service'
import { workspaceDataCodec } from './workspace-data-codec'

export class IDBBackendPoolService
  implements IBackendManagerService<BackendType.IndexedDB>
{
  private getDBName(workspaceId: WorkspaceId): string {
    return `todo-${workspaceId}`
  }

  private connection: {
    workspaceId: WorkspaceId
    db: IDB
    backend: IBackendService
  } | null = null

  resolve = async (
    workspace: Workspace<BackendType.IndexedDB>
  ): Promise<IBackendService> => {
    if (this.connection) {
      if (this.connection.workspaceId === workspace.id) {
        return this.connection.backend
      } else {
        this.connection.db.close()
      }
    }
    const db = await openDB<IDBSchema>(
      this.getDBName(workspace.id),
      TARGET_IDB_SCHEMA_VERSION,
      {
        async upgrade(db, oldVersion) {
          // Init
          if (oldVersion < 1) {
            db.createObjectStore('task', { keyPath: 'id' })
            db.createObjectStore('tasksList', { keyPath: 'id' })
            const events = db.createObjectStore('event', {
              keyPath: 'id',
            })
            events.createIndex('byCreatedAt', 'createdAt')
          }
        },
      }
    )
    const backend = new IDBBackendService(db, workspaceDataCodec)
    this.connection = {
      workspaceId: workspace.id,
      db,
      backend,
    }
    return backend
  }

  release = async (
    workspace: Workspace<BackendType.IndexedDB>
  ): Promise<void> => {
    if (this.connection?.workspaceId === workspace.id) {
      this.connection.db.close()
      this.connection = null
    }
    await deleteDB(this.getDBName(workspace.id))
  }
}
