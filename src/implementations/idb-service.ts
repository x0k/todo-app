import { type IDB, IDB_SCHEMA_KEYS } from '@/shared/idb-schema'
import {
  type EncodedWorkspaceData,
  type IIDBService,
  type WorkspaceData,
  type WorkspaceId,
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'

export class IDBService implements IIDBService {
  constructor(
    private readonly workspaceDataCodec: ICodecService<
      WorkspaceData,
      EncodedWorkspaceData
    >
  ) {}

  getDBName = (workspaceId: WorkspaceId): string => `todo-${workspaceId}`

  exportAsEncodedData = async (db: IDB): Promise<EncodedWorkspaceData> => {
    const data: WorkspaceData = {
      tasks: await db.getAll('task'),
      events: await db.getAll('event'),
      tasksLists: await db.getAll('tasksList'),
    }
    return this.workspaceDataCodec.encode(data)
  }

  importFromEncodedData = async (
    db: IDB,
    data: EncodedWorkspaceData
  ): Promise<void> => {
    const { events, tasks, tasksLists } = this.workspaceDataCodec.decode(data)
    const tx = db.transaction(IDB_SCHEMA_KEYS, 'readwrite')
    const tasksStore = tx.objectStore('task')
    const eventsStore = tx.objectStore('event')
    const tasksListsStore = tx.objectStore('tasksList')
    await Promise.all([
      tasksStore.clear(),
      eventsStore.clear(),
      tasksListsStore.clear(),
    ])
    await Promise.all([
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      ...tasks.map((task) => tasksStore.put(task)),
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      ...events.map((event) => eventsStore.put(event)),
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      ...tasksLists.map((tasksList) => tasksListsStore.put(tasksList)),
      tx.done,
    ])
  }
}
