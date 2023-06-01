import { type IDB, IDB_SCHEMA_KEYS } from '@/shared/idb-schema'
import {
  type EncodedWorkspaceData,
  type IBackendService,
  type Workspace,
  type WorkspaceData,
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import {
  IDBTasksListService,
  type ITasksListService,
} from '@/entities/tasks-list'
import { IDBToDoService, type IToDoService } from '@/entities/todo'

export class IDBBackendService implements IBackendService {
  constructor(
    private readonly db: IDB,
    private readonly workspaceDataCodec: ICodecService<
      WorkspaceData,
      EncodedWorkspaceData
    >
  ) {}

  getTasksListService = async ({
    tasksListId,
  }: WorkspaceTasksListRouteParams): Promise<ITasksListService> => {
    return new IDBTasksListService(this.db, tasksListId)
  }

  getToDoService = async (): Promise<IToDoService> =>
    new IDBToDoService(this.db)

  export = async (): Promise<EncodedWorkspaceData> => {
    const data: WorkspaceData = {
      tasks: await this.db.getAll('task'),
      events: await this.db.getAll('event'),
      tasksLists: await this.db.getAll('tasksList'),
    }
    return this.workspaceDataCodec.encode(data)
  }

  import = async (_: Workspace, data: EncodedWorkspaceData): Promise<void> => {
    const { events, tasks, tasksLists } = this.workspaceDataCodec.decode(data)
    const tx = this.db.transaction(IDB_SCHEMA_KEYS, 'readwrite')
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
