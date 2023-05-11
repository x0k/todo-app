import {
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'

import { type ITasksListService, type TasksListState } from './core'

export class TestTasksListService implements ITasksListService {
  constructor(
    private readonly tasksLists: Map<TasksListId, TasksList>,
    private readonly tasks: Map<TaskId, Task>
  ) {}

  loadTasksList = async (id: TasksListId): Promise<TasksListState> => {
    const tasksList = this.tasksLists.get(id)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id "${id}" not found.`)
    }
    return {
      tasks: this.tasks,
      tasksList,
    }
  }
}
