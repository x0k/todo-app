import { nanoid } from 'nanoid'

import {
  type Event,
  EventType,
  TASK_STATUSES,
  type Task,
  type TaskCompletedEvent,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type Tasks,
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
  type IToDoService,
  type QueryEvents,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
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
export class TestToDoService implements IToDoService {
  getEventsCount = async (): Promise<number> => 0

  loadEvents = async (_: QueryEvents): Promise<Event[]> => []

  loadTasksState = async (): Promise<TasksState> => {
    return {
      tasks: new Map(),
      lists: new Map(),
    }
  }

  createTask = async ({
    tasksListId,
    title,
  }: CreateTask): Promise<TaskCreatedEvent> => {
    return {
      type: EventType.TaskCreated,
      task: createTask(tasksListId, title),
      createdAt: new Date(),
      tasksListId,
    }
  }

  createTasks = async ({
    tasks,
    tasksListId,
  }: CreateTasks): Promise<TasksCreatedEvent> => {
    return {
      type: EventType.TasksCreated,
      createdAt: new Date(),
      tasks: tasks.map((title) => createTask(tasksListId, title)),
      tasksListId,
    }
  }

  createTasksList = async ({
    title,
    tasks: tasksTitles,
  }: CreateTasksList): Promise<TasksListCreatedEvent> => {
    const tasksList: TasksList = {
      id: nanoid() as TasksListId,
      createdAt: new Date(),
      isArchived: false,
      tasks: Object.fromEntries(
        TASK_STATUSES.map((s) => [s, new Set()])
      ) as Tasks,
      tasksCount: tasksTitles.length,
      title,
    }
    const tasks = tasksTitles.map((title) => createTask(tasksList.id, title))
    for (const task of tasks) {
      tasksList.tasks[task.status].add(task.id)
    }
    return {
      type: EventType.TasksListCreated,
      createdAt: tasksList.createdAt,
      list: tasksList,
      tasks,
    }
  }

  updateTask = async ({
    taskId,
    change,
  }: UpdateTask): Promise<TaskUpdatedEvent> => {
    return {
      type: EventType.TaskUpdated,
      createdAt: new Date(),
      change,
      taskId,
    }
  }

  updateTasksList = async ({
    tasksListId,
    change,
  }: UpdateTasksList): Promise<TasksListUpdatedEvent> => {
    return {
      type: EventType.TasksListUpdated,
      tasksListId,
      createdAt: new Date(),
      change,
    }
  }

  completeTask = async ({
    taskId,
    message,
  }: CompleteTask): Promise<TaskCompletedEvent> => {
    return {
      type: EventType.TaskCompleted,
      taskId,
      createdAt: new Date(),
      message,
    }
  }

  archiveTasks = async ({
    tasksIds,
  }: ArchiveTasks): Promise<TasksArchivedEvent> => {
    return {
      type: EventType.TasksArchived,
      createdAt: new Date(),
      tasksIds,
    }
  }
}
