import { type TasksListId } from '@/shared/kernel'

import { type IToDoService } from '../../todo'
import { type ITasksListService, type TasksListState } from '../core'

export class TestTasksListService implements ITasksListService {
  constructor(
    private readonly tasksListId: TasksListId,
    private readonly todoService: IToDoService
  ) {}

  loadTasksList = async (): Promise<TasksListState> => {
    const { lists, tasks } = await this.todoService.loadTasksState()
    const tasksList = lists.get(this.tasksListId)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id "${this.tasksListId}" not found.`)
    }
    return {
      tasksList,
      tasks,
    }
  }
}
