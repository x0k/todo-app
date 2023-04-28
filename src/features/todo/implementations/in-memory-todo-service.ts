import { nanoid } from 'nanoid'

import {
  type ChangeTaskStatus,
  type ChangeTasksStatus,
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  EventType,
  type IToDoService,
  TASK_STATUSES,
  type Task,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskStatusChangedEvent,
  type TaskUpdatedEvent,
  type Tasks,
  type TasksCreatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
  type TasksState,
  type TasksStatusChangedEvent,
  type UpdateTask,
  type UpdateTasksList,
} from '@/domain/todo'

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
  loadTasksState = async (): Promise<TasksState> => {
    return {
      tasks: new Map(),
      lists: new Map(),
      events: [],
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

  changeTaskStatus = async ({
    taskId,
    newStatus,
  }: ChangeTaskStatus): Promise<TaskStatusChangedEvent> => {
    return {
      type: EventType.TaskStatusChanged,
      taskId,
      createdAt: new Date(),
      newStatus,
    }
  }

  changeTasksStatus = async ({
    tasksIds,
    newStatus,
  }: ChangeTasksStatus): Promise<TasksStatusChangedEvent> => {
    return {
      type: EventType.TasksStatusChanged,
      createdAt: new Date(),
      newStatus,
      tasksIds,
    }
  }
}
