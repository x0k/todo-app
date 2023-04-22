import { app } from '@/common/app'

import {
  type CreateTask,
  type CreateTasksList,
  type TaskCreatedEvent,
  type TaskUpdatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListUpdatedEvent,
  type UpdateTask,
  type UpdateTasksList,
} from './model'

export const todo = app.createDomain('ToDo')

// Stores

export const $taskLists = todo.createStore([])

// Events

export const taskCreated = todo.createEvent<CreateTask>()

export const tasksListCreated = todo.createEvent<CreateTasksList>()

export const taskUpdated = todo.createEvent<UpdateTask>()

export const TasksListUpdated = todo.createEvent<UpdateTasksList>()

// Effects

export const loadTasksListsFx = todo.createEffect<void, TasksList[]>()

export const createTaskFx = todo.createEffect<CreateTask, TaskCreatedEvent>()

export const createTasksListFx = todo.createEffect<
  CreateTasksList,
  TasksListCreatedEvent
>()

export const updateTaskFx = todo.createEffect<UpdateTask, TaskUpdatedEvent>()

export const updateTasksListFx = todo.createEffect<
  UpdateTasksList,
  TasksListUpdatedEvent
>()

export interface ToDoHandlers {
  loadTasksLists: () => Promise<TasksList[]>
  createTask: (data: CreateTask) => Promise<TaskCreatedEvent>
  createTasksList: (data: CreateTasksList) => Promise<TasksListCreatedEvent>
  updateTask: (data: UpdateTask) => Promise<TaskUpdatedEvent>
  updateTasksList: (data: UpdateTasksList) => Promise<TasksListUpdatedEvent>
}
