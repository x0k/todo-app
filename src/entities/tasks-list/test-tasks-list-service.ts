import {
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'

import { type ITasksListService } from './core'

export class TestTasksListService implements ITasksListService {
  constructor(
    private readonly tasksLists: Map<TasksListId, TasksList>,
    private readonly tasks: Map<TaskId, Task>
  ) {}

  loadTasksList = async (id: TasksListId): Promise<TasksList> => {
    const tasksList = this.tasksLists.get(id)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id "${id}" not found.`)
    }
    return tasksList
  }
}
