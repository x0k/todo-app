import { Task, TaskId, TasksList } from '@/shared/kernel'

import { ITasksListService, TasksListState } from '../core'

export class InMemoryTasksListService implements ITasksListService {
  constructor(
    private readonly tasksList: TasksList,
    private readonly tasks: Map<TaskId, Task>
  ) {}

  loadTasksList = async (): Promise<TasksListState> => ({
    tasksList: this.tasksList,
    tasks: this.tasks,
  })
}
