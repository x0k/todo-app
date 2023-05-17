import { nanoid } from 'nanoid'

import {
  Event,
  EventType,
  Task,
  TaskCompletedEvent,
  TaskCreatedEvent,
  TaskId,
  TaskStatus,
  TaskUpdatedEvent,
  TasksArchivedEvent,
  TasksCreatedEvent,
  TasksList,
  TasksListCreatedEvent,
  TasksListId,
  TasksListUpdatedEvent,
} from '@/shared/kernel'
import { isDefined } from '@/shared/lib/guards'

import {
  ArchiveTasks,
  CompleteTask,
  CreateTask,
  CreateTasks,
  CreateTasksList,
  EVENTS_PER_PAGE,
  IToDoService,
  QueryEvents,
  TasksState,
  UpdateTask,
  UpdateTasksList,
} from './core'

function createTask(tasksListId: TasksListId, title: string): Task {
  return {
    id: nanoid() as TaskId,
    title,
    createdAt: new Date(),
    status: TaskStatus.NotDone,
    tasksListId,
  }
}

export class InMemoryToDoService implements IToDoService {
  private events: Event[] = []
  private lists = new Map<TasksListId, TasksList>()
  private tasks = new Map<TaskId, Task>()

  private updateTaskStatus(task: Task, status: TaskStatus): void {
    const tasksList = this.lists.get(task.tasksListId)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${task.tasksListId} not found`)
    }
    tasksList.tasks[task.status].delete(task.id)
    tasksList.tasks[status].add(task.id)
    task.status = status
  }

  loadTasksState = async (): Promise<TasksState> => ({
    lists: this.lists,
    tasks: this.tasks,
  })

  createTask = async ({
    tasksListId,
    title,
  }: CreateTask): Promise<TaskCreatedEvent> => {
    const tasksList = this.lists.get(tasksListId)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${tasksListId} not found`)
    }
    const task = createTask(tasksListId, title)
    this.tasks.set(task.id, task)
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    return {
      type: EventType.TaskCreated,
      task,
      createdAt: new Date(),
      tasksListId: tasksListId,
    }
  }

  createTasks = async ({
    tasksListId,
    tasks,
  }: CreateTasks): Promise<TasksCreatedEvent> => {
    const tasksList = this.lists.get(tasksListId)
    if (tasksList === undefined) {
      throw new Error(`TasksList with id ${tasksListId} not found`)
    }
    const result: Task[] = []
    for (const title of tasks) {
      const task = createTask(tasksListId, title)
      result.push(task)
      this.tasks.set(task.id, task)
      tasksList.tasks[task.status].add(task.id)
    }
    tasksList.tasksCount += result.length
    return {
      createdAt: new Date(),
      type: EventType.TasksCreated,
      tasks: result,
      tasksListId,
    }
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
    return {
      createdAt: new Date(),
      list,
      tasks: realTasks,
      type: EventType.TasksListCreated,
    }
  }

  updateTask = async ({
    taskId,
    change,
  }: UpdateTask): Promise<TaskUpdatedEvent> => {
    const task = this.tasks.get(taskId)
    if (task === undefined) {
      throw new Error(`Task with id ${taskId} not found`)
    }
    Object.assign(task, change)
    return {
      createdAt: new Date(),
      change,
      taskId,
      type: EventType.TaskUpdated,
    }
  }

  updateTasksList = async ({
    tasksListId,
    change,
  }: UpdateTasksList): Promise<TasksListUpdatedEvent> => {
    const list = this.lists.get(tasksListId)
    if (list === undefined) {
      throw new Error(`TasksList with id ${tasksListId} not found`)
    }
    Object.assign(list, change)
    return {
      change,
      createdAt: new Date(),
      tasksListId,
      type: EventType.TasksListUpdated,
    }
  }

  completeTask = async ({
    taskId,
    message,
  }: CompleteTask): Promise<TaskCompletedEvent> => {
    const task = this.tasks.get(taskId)
    if (task === undefined) {
      throw new Error(`Task with id ${taskId} not found`)
    }
    this.updateTaskStatus(task, TaskStatus.Done)
    return {
      createdAt: new Date(),
      message,
      taskId,
      type: EventType.TaskCompleted,
    }
  }

  archiveTasks = async ({
    tasksIds,
  }: ArchiveTasks): Promise<TasksArchivedEvent> => {
    tasksIds
      .map((taskId) => this.tasks.get(taskId))
      .filter(isDefined)
      .forEach((task) => this.updateTaskStatus(task, TaskStatus.Archived))
    return {
      type: EventType.TasksArchived,
      createdAt: new Date(),
      tasksIds,
    }
  }

  getEventsCount = async (): Promise<number> => this.events.length

  loadEvents = async ({ page }: QueryEvents): Promise<Event[]> => {
    const start = (page - 1) * EVENTS_PER_PAGE
    const end = start + EVENTS_PER_PAGE
    return this.events.slice(start, end)
  }
}
