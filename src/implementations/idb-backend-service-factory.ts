import { deleteDB, openDB } from 'idb'

import { type IDBSchema, TARGET_IDB_SCHEMA_VERSION } from '@/shared/idb-schema'
import {
  type BackendType,
  type IBackendService,
  type IBackendPoolService,
  type Workspace,
  type WorkspaceId,
} from '@/shared/kernel'

import { IDBBackendService } from './idb-backend-service'
import { workspaceDataCodec } from './workspace-data-codec'

export class IDBBackendServiceFactory
  implements IBackendPoolService<BackendType.IndexedDB>
{
  private getDBName(workspaceId: WorkspaceId): string {
    return `todo-${workspaceId}`
  }

  resolve = async (
    workspace: Workspace<BackendType.IndexedDB>
  ): Promise<IBackendService> =>
    new IDBBackendService(
      await openDB<IDBSchema>(
        this.getDBName(workspace.id),
        TARGET_IDB_SCHEMA_VERSION,
        {
          async upgrade(db, oldVersion) {
            // Init
            if (oldVersion < 1) {
              db.createObjectStore('task', { keyPath: 'id' })
              db.createObjectStore('tasksList', { keyPath: 'id' })
              const events = db.createObjectStore('event', { keyPath: 'id' })
              events.createIndex('byCreatedAt', 'createdAt')
            }
          },
        }
      ),
      workspaceDataCodec
    )

  release = async (
    workspace: Workspace<BackendType.IndexedDB>
  ): Promise<void> => {
    await deleteDB(this.getDBName(workspace.id))
  }
}
