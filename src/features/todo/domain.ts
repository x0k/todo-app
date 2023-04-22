import { app } from '@/common/app'

import {
  type CreateTask,
  type CreateTasksList,
  type Task,
  type TaskCreatedEvent,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListUpdatedEvent,
  type UpdateTask,
  type UpdateTasksList,
} from './model'

export const todo = app.createDomain('ToDo')

// Stores

export const $tasksLists = todo.createStore<TasksList[]>([])

export const $tasksMap = $tasksLists.map(
  (lists) => new Map(lists.map((list) => [list.id, list]))
)

export const $date = todo.createStore(new Date())

export const $dashboard = $tasksLists.map((lists) => {
  const notDoneTasks: Task[] = []
  const doneTasks: Task[] = []
  for (const list of lists) {
    if (
      list.tasks.length === 0 ||
      list.tasks.every((task) => task.status === TaskStatus.Archived)
    ) {
      continue
    }
    const doneTask = list.tasks.find((task) => task.status === TaskStatus.Done)
    if (doneTask === undefined) {
      const notDoneTask = list.tasks.find(
        (task) => task.status === TaskStatus.NotDone
      )
      if (notDoneTask !== undefined) {
        notDoneTasks.push(list.tasks[0])
      }
    } else {
      doneTasks.push(doneTask)
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
