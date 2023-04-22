import { nanoid } from 'nanoid'

import { isArrayOfSomething } from '@/lib/guards'
import { makeMap } from '@/lib/iterable'

import {
  type CreateTask,
  type CreateTasksList,
  EventType,
  type IToDoService,
  type Task,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
  type UpdateTask,
  type UpdateTasksList,
} from '../model'

type InMemoryTasksList = Omit<TasksList, 'tasks'> & { tasks: TaskId[] }

export class InMemoryToDoService implements IToDoService {
  private readonly tasks = new Map<TaskId, Task>()
  private readonly tasksLists = new Map<TasksListId, InMemoryTasksList>()

  private readonly toRealTasksList = (mem: InMemoryTasksList): TasksList => {
    const tasks = mem.tasks.map((taskId) => this.tasks.get(taskId))
    if (isArrayOfSomething<Task>(tasks)) {
      return {
        ...mem,
        tasks,
      }
    }
    throw new Error('Invalid tasks list')
  }

  loadTasksLists = async (): Promise<TasksList[]> => {
    return Array.from(makeMap(this.toRealTasksList)(this.tasksLists.values()))
  }

  createTask = async (data: CreateTask): Promise<TaskCreatedEvent> => {
    const tasksList = this.tasksLists.get(data.tasksListId)
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
    tasksList.tasks.push(task.id)
    return {
      type: EventType.TaskCreated,
      createdAt: task.createdAt,
      task,
    }
  }

  createTasksList = async (
    data: CreateTasksList
  ): Promise<TasksListCreatedEvent> => {
    const tasksList: InMemoryTasksList = {
      id: nanoid() as TasksListId,
      createdAt: new Date(),
      isArchived: false,
      tasks: [],
      title: data.title,
    }
    this.tasksLists.set(tasksList.id, tasksList)
    await Promise.all(
      data.tasks.map(
        async (title) =>
          await this.createTask({ title, tasksListId: tasksList.id })
      )
    )
    return {
      type: EventType.TasksListCreated,
      createdAt: tasksList.createdAt,
      list: this.toRealTasksList(tasksList),
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
      tasksListId: task.tasksListId,
    }
  }

  updateTasksList = async ({
    tasksListId,
    change,
  }: UpdateTasksList): Promise<TasksListUpdatedEvent> => {
    const tasksList = this.tasksLists.get(tasksListId)
    if (tasksList === undefined) {
      throw new Error(`Tasks list with id ${tasksListId} not found`)
    }
    this.tasksLists.set(tasksListId, { ...tasksList, ...change })
    return {
      type: EventType.TasksListUpdated,
      tasksListId,
      createdAt: new Date(),
      change,
    }
  }
}
