import { nanoid } from 'nanoid'

import {
  type CreateTask,
  type CreateTasksList,
  EventType,
  type IToDoService,
  TASK_STATUSES,
  type Task,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type Tasks,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
} from '../model'

export class InMemoryToDoService implements IToDoService {
  private readonly tasks = new Map<TaskId, Task>()
  private readonly lists = new Map<TasksListId, TasksList>()

  loadTasksState = async (): Promise<TasksState> => {
    return {
      tasks: this.tasks,
      lists: this.lists,
    }
  }

  createTask = async (data: CreateTask): Promise<TaskCreatedEvent> => {
    const tasksList = this.lists.get(data.tasksListId)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id ${data.tasksListId} not found`)
    }
    const task: Task = {
      ...data,
      id: nanoid() as TaskId,
      createdAt: new Date(),
      status: TaskStatus.NotDone,
    }
    this.tasks.set(task.id, task)
    tasksList.tasks[task.status].add(task.id)
    tasksList.tasksCount++
    return {
      type: EventType.TaskCreated,
      createdAt: task.createdAt,
      task,
    }
  }

  createTasksList = async (
    data: CreateTasksList
  ): Promise<TasksListCreatedEvent> => {
    const tasks = Object.fromEntries(
      TASK_STATUSES.map((s) => [s, new Set()])
    ) as Tasks
    const tasksList: TasksList = {
      id: nanoid() as TasksListId,
      createdAt: new Date(),
      isArchived: false,
      tasks,
      tasksCount: 0,
      title: data.title,
    }
    this.lists.set(tasksList.id, tasksList)
    const taskCreatedEvents = await Promise.all(
      data.tasks.map(
        async (title) =>
          await this.createTask({ title, tasksListId: tasksList.id })
      )
    )
    return {
      type: EventType.TasksListCreated,
      createdAt: tasksList.createdAt,
      list: tasksList,
      tasks: taskCreatedEvents.map((e) => e.task),
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
    this.tasks.set(taskId, { ...task, ...change })
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
    const tasksList = this.lists.get(tasksListId)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id ${tasksListId} not found`)
    }
    this.lists.set(tasksListId, { ...tasksList, ...change })
    return {
      type: EventType.TasksListUpdated,
      tasksListId,
      createdAt: new Date(),
      change,
    }
  }
}
