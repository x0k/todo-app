import { eq } from 'drizzle-orm'

import { TaskStatus, type Tasks, type TasksListId } from '@/shared/kernel'
import { type PSDB, type PSTask, tasksLists } from '@/shared/planetscale-schema'

import { type ITasksListService, type TasksListState } from '../core'

export class PlanetScaleTasksListService implements ITasksListService {
  private groupTasks(tasks: PSTask[]): Tasks {
    const acc: Tasks = {
      [TaskStatus.Archived]: new Set(),
      [TaskStatus.Done]: new Set(),
      [TaskStatus.NotDone]: new Set(),
    }
    for (const task of tasks) {
      acc[task.status].add(task.id)
    }
    return acc
  }

  constructor(
    private readonly db: PSDB,
    private readonly tasksListId: TasksListId
  ) {}

  loadTasksList = async (): Promise<TasksListState> => {
    const data = await this.db.query.tasksLists.findFirst({
      where: eq(tasksLists.id, this.tasksListId),
      with: {
        tasks: true,
      },
    })
    if (data === undefined) {
      throw new Error(`Tasks list with id ${this.tasksListId} not found`)
    }
    return {
      tasksList: {
        ...data,
        tasks: this.groupTasks(data.tasks),
        tasksCount: data.tasks.length,
      },
      tasks: new Map(data.tasks.map((task) => [task.id, task])),
    }
  }
}
