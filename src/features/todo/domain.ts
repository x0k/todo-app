import { app } from '@/common/app'

import {
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  type Task,
  type TaskCreatedEvent,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksCreatedEvent,
  type TasksListCreatedEvent,
  type TasksListUpdatedEvent,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
} from './model'

export const todo = app.createDomain('ToDo')

// Stores

export const $tasksState = todo.createStore<TasksState>({
  lists: new Map(),
  tasks: new Map(),
})

export const $listsMap = $tasksState.map((state) => state.lists)

export const $tasksMap = $tasksState.map((state) => state.tasks)

export const $date = todo.createStore(new Date())

export const $dashboard = $tasksState.map((state) => {
  const notDoneTasks: Task[] = []
  const doneTasks: Task[] = []
  for (const list of state.lists.values()) {
    const { tasks } = list
    if (
      list.tasksCount === 0 ||
      list.tasksCount === tasks[TaskStatus.Archived].size
    ) {
      continue
    }
    if (tasks[TaskStatus.Done].size > 0) {
      for (const taskId of tasks[TaskStatus.Done]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          doneTasks.push(task)
        }
      }
    } else {
      for (const taskId of tasks[TaskStatus.NotDone]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          notDoneTasks.push(task)
          break
        }
      }
    }
  }
  return {
    doneTasks,
    notDoneTasks,
  }
})

// Events

export const doneTasksArchiving = todo.createEvent()

// Effects

export const loadTasksStateFx = todo.createEffect<void, TasksState>()

export const createTaskFx = todo.createEffect<CreateTask, TaskCreatedEvent>()

export const createTasksFx = todo.createEffect<CreateTasks, TasksCreatedEvent>()

export const createTasksListFx = todo.createEffect<
  CreateTasksList,
  TasksListCreatedEvent
>()

export const updateTaskFx = todo.createEffect<UpdateTask, TaskUpdatedEvent>()

export const updateTasksListFx = todo.createEffect<
  UpdateTasksList,
  TasksListUpdatedEvent
>()
