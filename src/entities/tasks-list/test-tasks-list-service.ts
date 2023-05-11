import { type TasksListId } from '@/shared/kernel'

import { type IToDoService } from '../todo'
import { type ITasksListService, type TasksListState } from './core'

export class TestTasksListService implements ITasksListService {
  constructor(private readonly todoService: IToDoService) {}

  loadTasksList = async (id: TasksListId): Promise<TasksListState> => {
    const { lists, tasks } = await this.todoService.loadTasksState()
    const tasksList = lists.get(id)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id "${id}" not found.`)
    }
    return {
      tasksList,
      tasks,
    }
  }
}
