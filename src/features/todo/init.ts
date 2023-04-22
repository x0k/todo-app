import { sample } from 'effector'

import { errorOccurred, started } from '@/common/app'

import { reducer } from './model'

import {
  $tasksLists,
  type ToDoHandlers,
  createTaskFx,
  createTasksListFx,
  loadTasksListsFx,
  updateTaskFx,
  updateTasksListFx,
} from './domain'

export function initToDo(handlers: ToDoHandlers): void {
  loadTasksListsFx.use(handlers.loadTasksLists)
  createTaskFx.use(handlers.createTask)
  updateTaskFx.use(handlers.updateTask)
  createTasksListFx.use(handlers.createTasksList)
  updateTasksListFx.use(handlers.updateTasksList)
}

sample({
  clock: started,
  target: loadTasksListsFx,
})

sample({
  clock: [
    loadTasksListsFx.failData,
    createTaskFx.failData,
    updateTaskFx.failData,
    createTasksListFx.failData,
    updateTasksListFx.failData,
  ],
  target: errorOccurred,
})

$tasksLists
  .on(loadTasksListsFx.doneData, (_, payload) => payload)
  .on(
    [
      createTaskFx.doneData,
      updateTaskFx.doneData,
      createTasksListFx.doneData,
      updateTasksListFx.doneData,
    ],
    reducer
  )
