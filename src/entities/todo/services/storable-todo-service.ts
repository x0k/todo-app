import { nanoid } from 'nanoid'

import {
  type Event,
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
import { type IAsyncStorageService } from '@/shared/storage'

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

export interface StorableToDoServiceState extends TasksState {
  events: Event[]
}

export class StorableToDoService implements IToDoService {
  private registerTask(
    state: TasksState,
    tasksList: TasksList,
    title: string
  ): Task {
    const task = {
      id: nanoid() as TaskId,
      title,
      createdAt: new Date(),
      status: TaskStatus.NotDone,
      tasksListId: tasksList.id,
    }
    state.tasks.set(task.id, task)
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    return task
  }

  private async transaction<E extends Event>(
    action: (state: TasksState) => E
  ): Promise<E> {
    const state = await this.storageService.load()
    const event = action(state)
    state.events.unshift(event)
    await this.storageService.save(state)
    return event
  }

  private getTaskById({ tasks }: TasksState, id: TaskId): Task {
    const task = tasks.get(id)
    if (task === undefined) {
      throw new Error(`Task with id ${id} not found`)
    }
    return task
  }

  private getTasksListById({ lists }: TasksState, id: TasksListId): TasksList {
    const tasksList = lists.get(id)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${id} not found`)
    }
    return tasksList
  }

  private updateTaskStatus(
    state: TasksState,
    taskId: TaskId,
    status: TaskStatus
  ): Task {
    const task = this.getTaskById(state, taskId)
    const tasksList = this.getTasksListById(state, task.tasksListId)
    tasksList.tasks[task.status].delete(task.id)
    tasksList.tasks[status].add(task.id)
    task.status = status
    return task
  }

  constructor(
    private readonly storageService: IAsyncStorageService<StorableToDoServiceState>
  ) {}

  loadTasksState = async (): Promise<TasksState> =>
    await this.storageService.load()

  createTask = async ({
    tasksListId,
    title,
  }: CreateTask): Promise<TaskCreatedEvent> =>
    await this.transaction((state) => {
      const tasksList = this.getTasksListById(state, tasksListId)
      const task = this.registerTask(state, tasksList, title)
      return {
        type: EventType.TaskCreated,
        task,
        createdAt: new Date(),
        tasksListId,
      }
    })

  createTasks = async ({
    tasksListId,
    tasks: titles,
  }: CreateTasks): Promise<TasksCreatedEvent> =>
    await this.transaction((state) => {
      const list = this.getTasksListById(state, tasksListId)
      const tasks = titles.map((title) => this.registerTask(state, list, title))
      return {
        createdAt: new Date(),
        type: EventType.TasksCreated,
        tasks,
        tasksListId,
      }
    })

  createTasksList = async ({
    title,
    tasks: titles,
  }: CreateTasksList): Promise<TasksListCreatedEvent> =>
    await this.transaction((state) => {
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
      state.lists.set(list.id, list)
      const tasks = titles.map((title) => this.registerTask(state, list, title))
      return {
        createdAt: new Date(),
        list,
        tasks,
        type: EventType.TasksListCreated,
      }
    })

  updateTask = async ({
    taskId,
    change,
  }: UpdateTask): Promise<TaskUpdatedEvent> =>
    await this.transaction((state) => {
      const task = this.getTaskById(state, taskId)
      Object.assign(task, change)
      return {
        createdAt: new Date(),
        change,
        taskId,
        type: EventType.TaskUpdated,
      }
    })

  updateTasksList = async ({
    tasksListId,
    change,
  }: UpdateTasksList): Promise<TasksListUpdatedEvent> =>
    await this.transaction((state) => {
      const list = this.getTasksListById(state, tasksListId)
      Object.assign(list, change)
      return {
        change,
        createdAt: new Date(),
        tasksListId,
        type: EventType.TasksListUpdated,
      }
    })

  completeTask = async ({
    taskId,
    message,
  }: CompleteTask): Promise<TaskCompletedEvent> =>
    await this.transaction((state) => {
      this.updateTaskStatus(state, taskId, TaskStatus.Done)
      return {
        createdAt: new Date(),
        type: EventType.TaskCompleted,
        taskId,
        message,
      }
    })

  archiveTasks = async ({
    tasksIds,
  }: ArchiveTasks): Promise<TasksArchivedEvent> =>
    await this.transaction((state) => {
      for (const taskId of tasksIds) {
        this.updateTaskStatus(state, taskId, TaskStatus.Archived)
      }
      return {
        createdAt: new Date(),
        tasksIds,
        type: EventType.TasksArchived,
      }
    })

  getEventsCount = async (): Promise<number> => {
    const { events } = await this.storageService.load()
    return events.length
  }

  loadEvents = async ({ page }: QueryEvents): Promise<Event[]> => {
    const { events } = await this.storageService.load()
    return events.slice((page - 1) * EVENTS_PER_PAGE, page * EVENTS_PER_PAGE)
  }
}
