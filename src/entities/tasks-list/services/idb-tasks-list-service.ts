import { type IDBPDatabase } from 'idb'

import { type IDBSchema } from '@/shared/idb-schema'
import { type TasksListId } from '@/shared/kernel'

import { type ITasksListService, type TasksListState } from '../core'

export class IDBTasksListService implements ITasksListService {
  constructor(
    private readonly dbService: IDBPDatabase<IDBSchema>,
    private readonly tasksListId: TasksListId
  ) {}

  loadTasksList = async (): Promise<TasksListState> => {
    const tasksList = await this.dbService.get('tasksList', this.tasksListId)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${this.tasksListId} not found`)
    }
    const tasks = await this.dbService.getAll('task')
    return {
      tasksList,
      tasks: new Map(
        tasks.map((t) => {
          return [t.id, t]
        })
      ),
    }
  }
}
