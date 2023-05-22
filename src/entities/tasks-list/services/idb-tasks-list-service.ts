import { type IDBPDatabase } from 'idb'

import { type ITasksListSe, TasksListStatervice } from '../core'

export class IDBTasksListService implements ITasksListService {
  constructor(private readonly dbService: IDBPDatabase<unknown>) {}

  loadTasksList = async (): Promise<TasksListState> => {}
}
