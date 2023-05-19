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
  type WorkspaceId,
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

interface ToDoServiceState {
  lists: Map<TasksListId, TasksList>
  tasks: Map<TaskId, Task>
  events: Event[]
}

export class InMemoryToDoService implements IToDoService {
  private static readonly states = new Map<WorkspaceId, ToDoServiceState>()

  private readonly events: Event[]
  private readonly lists: Map<TasksListId, TasksList>
  private readonly tasks: Map<TaskId, Task>

  private getTaskById(id: TaskId): Task {
    const task = this.tasks.get(id)
    if (task === undefined) {
      throw new Error(`Task with id ${id} not found`)
    }
    return task
  }

  private getTasksListById(id: TasksListId): TasksList {
    const tasksList = this.lists.get(id)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${id} not found`)
    }
    return tasksList
  }

  private updateTaskStatus(taskId: TaskId, status: TaskStatus): Task {
    const task = this.getTaskById(taskId)
    const tasksList = this.getTasksListById(task.tasksListId)
    tasksList.tasks[task.status].delete(task.id)
    tasksList.tasks[status].add(task.id)
    task.status = status
    return task
  }

  private registerEvent<E extends Event>(event: E): E {
    this.events.unshift(event)
    return event
  }

  private makeTask(tasksListId: TasksListId, title: string): Task {
    return {
      id: nanoid() as TaskId,
      title,
      createdAt: new Date(),
      status: TaskStatus.NotDone,
      tasksListId,
    }
  }

  constructor(workspaceId: WorkspaceId) {
    const state = InMemoryToDoService.states.get(workspaceId)
    if (state !== undefined) {
      this.lists = state.lists
      this.tasks = state.tasks
      this.events = state.events
    } else {
      this.lists = new Map<TasksListId, TasksList>()
      this.tasks = new Map<TaskId, Task>()
      this.events = []
      InMemoryToDoService.states.set(workspaceId, {
        events: this.events,
        lists: this.lists,
        tasks: this.tasks,
      })
    }
  }

  loadTasksState = async (): Promise<TasksState> => ({
    lists: this.lists,
    tasks: this.tasks,
  })

  createTask = async ({
    tasksListId,
    title,
  }: CreateTask): Promise<TaskCreatedEvent> => {
    const tasksList = this.getTasksListById(tasksListId)
    const task = this.makeTask(tasksListId, title)
    this.tasks.set(task.id, task)
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    return this.registerEvent({
      type: EventType.TaskCreated,
      task,
      createdAt: new Date(),
      tasksListId,
    })
  }

  createTasks = async ({
    tasksListId,
    tasks,
  }: CreateTasks): Promise<TasksCreatedEvent> => {
    const tasksList = this.getTasksListById(tasksListId)
    const result: Task[] = []
    for (const title of tasks) {
      const task = this.makeTask(tasksListId, title)
      result.push(task)
      this.tasks.set(task.id, task)
      tasksList.tasks[task.status].add(task.id)
    }
    tasksList.tasksCount += result.length
    return this.registerEvent({
      createdAt: new Date(),
      type: EventType.TasksCreated,
      tasks: result,
      tasksListId,
    })
  }

  createTasksList = async ({
    tasks,
    title,
  }: CreateTasksList): Promise<TasksListCreatedEvent> => {
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
    this.lists.set(list.id, list)
    const { tasks: realTasks } = await this.createTasks({
      tasksListId: list.id,
      tasks,
    })
    return this.registerEvent({
      createdAt: new Date(),
      list,
      tasks: realTasks,
      type: EventType.TasksListCreated,
    })
  }

  updateTask = async ({
    taskId,
    change,
  }: UpdateTask): Promise<TaskUpdatedEvent> => {
    const task = this.getTaskById(taskId)
    Object.assign(task, change)
    return this.registerEvent({
      createdAt: new Date(),
      change,
      taskId,
      type: EventType.TaskUpdated,
    })
  }

  updateTasksList = async ({
    tasksListId,
    change,
  }: UpdateTasksList): Promise<TasksListUpdatedEvent> => {
    const list = this.getTasksListById(tasksListId)
    Object.assign(list, change)
    return this.registerEvent({
      change,
      createdAt: new Date(),
      tasksListId,
      type: EventType.TasksListUpdated,
    })
  }

  completeTask = async ({
    taskId,
    message,
  }: CompleteTask): Promise<TaskCompletedEvent> => {
    this.updateTaskStatus(taskId, TaskStatus.Done)
    return this.registerEvent({
      createdAt: new Date(),
      message,
      taskId,
      type: EventType.TaskCompleted,
    })
  }

  archiveTasks = async ({
    tasksIds,
  }: ArchiveTasks): Promise<TasksArchivedEvent> => {
    tasksIds.forEach((taskId) => {
      this.updateTaskStatus(taskId, TaskStatus.Archived)
    })
    return this.registerEvent({
      type: EventType.TasksArchived,
      createdAt: new Date(),
      tasksIds,
    })
  }

  getEventsCount = async (): Promise<number> => this.events.length

  loadEvents = async ({ page }: QueryEvents): Promise<Event[]> => {
    const start = (page - 1) * EVENTS_PER_PAGE
    const end = start + EVENTS_PER_PAGE
    return this.events.slice(start, end)
  }
}
