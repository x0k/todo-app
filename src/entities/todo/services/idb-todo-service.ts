import { type IDBPDatabase } from 'idb'
import { nanoid } from 'nanoid'

import {
  type IDBSchema,
  IDB_SCHEMA_KEYS,
  type Transaction,
} from '@/shared/idb-schema'
import {
  type Event,
  type Task,
  type TaskCompletedEvent,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksArchivedEvent,
  type TasksCreatedEvent,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
} from '@/shared/kernel'

import {
  type ArchiveTasks,
  type CompleteTask,
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  type IToDoService,
  type QueryEvents,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
} from '../core'

export class IDBToDoService implements IToDoService {
  private async registerTask(
    tx: Transaction,
    tasksListId: TasksListId,
    title: string
  ): Promise<Task> {
    const task = {
      id: nanoid() as TaskId,
      title,
      createdAt: new Date(),
      status: TaskStatus.NotDone,
      tasksListId,
    }
    tx.objectStore('task').add(task)
    const tasksListStore = tx.objectStore('tasksList')
    const tasksList = await tasksListStore.get(tasksListId)
    if (tasksList === undefined) {
      throw new Error('TasksList not found')
    }
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    await tasksListStore.put(tasksList)
    return task
  }

  constructor(private readonly dbService: IDBPDatabase<IDBSchema>) {}

  loadTasksState = async (): Promise<TasksState> => {
    const lists = await this.dbService.getAll('tasksList')
    const tasks = await this.dbService.getAll('task')
    return {
      lists: new Map(lists.map((l) => [l.id, l])),
      tasks: new Map(tasks.map((t) => [t.id, t])),
    }
  }

  createTask = async ({
    title,
    tasksListId,
  }: CreateTask): Promise<TaskCreatedEvent> => {
    const tx = this.dbService.transaction(IDB_SCHEMA_KEYS, 'readwrite')
  }

  createTasks = async (data: CreateTasks): Promise<TasksCreatedEvent> => {}

  createTasksList = async (
    data: CreateTasksList
  ): Promise<TasksListCreatedEvent> => {}

  updateTask = async (data: UpdateTask): Promise<TaskUpdatedEvent> => {}

  updateTasksList = async (
    data: UpdateTasksList
  ): Promise<TasksListUpdatedEvent> => {}

  completeTask = async (data: CompleteTask): Promise<TaskCompletedEvent> => {}

  archiveTasks = async (data: ArchiveTasks): Promise<TasksArchivedEvent> => {}

  getEventsCount = async (): Promise<number> => {}

  loadEvents = async (query: QueryEvents): Promise<Event[]> => {}
}
