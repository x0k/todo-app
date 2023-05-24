import { type IDBPDatabase } from 'idb'
import { nanoid } from 'nanoid'

import {
  type IDBSchema,
  IDB_SCHEMA_KEYS,
  type Transaction,
} from '@/shared/idb-schema'
import {
  type Event,
  type EventId,
  EventType,
  type Task,
  type TaskCompletedEvent,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksArchivedEvent,
  type TasksCreatedEvent,
  type TasksList,
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
  EVENTS_PER_PAGE,
  type IToDoService,
  type QueryEvents,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
} from '../core'

export class IDBToDoService implements IToDoService {
  private async getTaskById(tx: Transaction, taskId: TaskId): Promise<Task> {
    const task = await tx.objectStore('task').get(taskId)
    if (task === undefined) {
      throw new Error(`Task with id "${taskId}" not found`)
    }
    return task
  }

  private async getTasksListById(
    tx: Transaction,
    tasksListId: TasksListId
  ): Promise<TasksList> {
    const tasksList = await tx.objectStore('tasksList').get(tasksListId)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id "${tasksListId}" not found`)
    }
    return tasksList
  }

  private async registerTask(
    tx: Transaction,
    tasksList: TasksList,
    title: string
  ): Promise<Task> {
    const task = {
      id: nanoid() as TaskId,
      title,
      createdAt: new Date(),
      status: TaskStatus.NotDone,
      tasksListId: tasksList.id,
    }
    await tx.objectStore('task').add(task)
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    return task
  }

  private async mutateTasksList<R>(
    tx: Transaction,
    tasksListId: TasksListId,
    mutation: (list: TasksList) => Promise<R>
  ): Promise<R> {
    const tasksList = await this.getTasksListById(tx, tasksListId)
    const result = await mutation(tasksList)
    await tx.objectStore('tasksList').put(tasksList)
    return result
  }

  private async updateTaskStatus(
    tx: Transaction,
    taskId: TaskId,
    status: TaskStatus
  ): Promise<Task> {
    const task = await this.getTaskById(tx, taskId)
    await this.mutateTasksList(tx, task.tasksListId, async (tasksList) => {
      tasksList.tasks[task.status].delete(task.id)
      tasksList.tasks[status].add(task.id)
    })
    task.status = status
    await tx.objectStore('task').put(task)
    return task
  }

  private tx<A, E extends Event>(
    action: (tx: Transaction, arg: A) => Promise<Omit<E, 'createdAt' | 'id'>>
  ): (arg: A) => Promise<E> {
    return async (arg) => {
      const tx = this.dbService.transaction(IDB_SCHEMA_KEYS, 'readwrite')
      const event = {
        ...(await action(tx, arg)),
        id: nanoid() as EventId,
        createdAt: new Date(),
      } as E
      await tx.objectStore('event').add(event)
      await tx.done
      return event
    }
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

  createTask = this.tx<CreateTask, TaskCreatedEvent>(
    async (tx, { tasksListId, title }) => {
      const task = await this.mutateTasksList(
        tx,
        tasksListId,
        async (tasksList) => await this.registerTask(tx, tasksList, title)
      )
      return {
        type: EventType.TaskCreated,
        task,
        tasksListId,
      }
    }
  )

  createTasks = this.tx<CreateTasks, TasksCreatedEvent>(
    async (tx, { tasks: titles, tasksListId }) => {
      const tasks = await this.mutateTasksList(
        tx,
        tasksListId,
        async (tasksList) =>
          await Promise.all(
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            titles.map((title) => this.registerTask(tx, tasksList, title))
          )
      )
      return {
        type: EventType.TasksCreated,
        tasks,
        tasksListId,
      }
    }
  )

  createTasksList = this.tx<CreateTasksList, TasksListCreatedEvent>(
    async (tx, { title, tasks: titles }) => {
      const list: TasksList = {
        id: nanoid() as TasksListId,
        createdAt: new Date(),
        isArchived: false,
        tasks: {
          [TaskStatus.NotDone]: new Set<TaskId>(),
          [TaskStatus.Done]: new Set<TaskId>(),
          [TaskStatus.Archived]: new Set<TaskId>(),
        },
        tasksCount: 0,
        title,
      }
      const tasks = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        titles.map((title) => this.registerTask(tx, list, title))
      )
      await tx.objectStore('tasksList').add(list)
      return {
        type: EventType.TasksListCreated,
        list,
        tasks,
      }
    }
  )

  updateTask = this.tx<UpdateTask, TaskUpdatedEvent>(
    async (tx, { taskId, change }) => {
      const task = await this.getTaskById(tx, taskId)
      await tx.objectStore('task').put(Object.assign(task, change))
      return {
        type: EventType.TaskUpdated,
        change,
        taskId,
      }
    }
  )

  updateTasksList = this.tx<UpdateTasksList, TasksListUpdatedEvent>(
    async (tx, { tasksListId, change }) => {
      const tasksList = await this.getTasksListById(tx, tasksListId)
      await tx.objectStore('tasksList').put(Object.assign(tasksList, change))
      return {
        type: EventType.TasksListUpdated,
        change,
        tasksListId,
      }
    }
  )

  completeTask = this.tx<CompleteTask, TaskCompletedEvent>(
    async (tx, { taskId, message }) => {
      await this.updateTaskStatus(tx, taskId, TaskStatus.Done)
      return {
        type: EventType.TaskCompleted,
        message,
        taskId,
      }
    }
  )

  archiveTasks = this.tx<ArchiveTasks, TasksArchivedEvent>(
    async (tx, { tasksIds }) => {
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        tasksIds.map((taskId) =>
          this.updateTaskStatus(tx, taskId, TaskStatus.Archived)
        )
      )
      return {
        type: EventType.TasksArchived,
        tasksIds,
      }
    }
  )

  getEventsCount = async (): Promise<number> => {
    return await this.dbService.count('event')
  }

  loadEvents = async ({ page }: QueryEvents): Promise<Event[]> => {
    const events: Event[] = []
    let cursor = await this.dbService
      .transaction('event', 'readonly')
      .store.index('byCreatedAt')
      .openCursor()
    const shift = EVENTS_PER_PAGE * (page - 1)
    if (shift > 0 && cursor !== null) {
      cursor = await cursor.advance(shift)
    }
    let i = 0
    while (cursor !== null && i++ < EVENTS_PER_PAGE) {
      events.push(cursor.value)
      cursor = await cursor.continue()
    }
    return events
  }
}
