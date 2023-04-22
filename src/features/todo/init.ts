import { sample } from 'effector'

import { errorOccurred, started } from '@/common/app'

import { type IToDoService, reducer } from './model'

import {
  $tasksLists,
  createTaskFx,
  createTasksListFx,
  loadTasksListsFx,
  updateTaskFx,
  updateTasksListFx,
} from './domain'

export function initToDo(todoService: IToDoService): void {
  loadTasksListsFx.use(todoService.loadTasksLists)
  createTaskFx.use(todoService.createTask)
  updateTaskFx.use(todoService.updateTask)
  createTasksListFx.use(todoService.createTasksList)
  updateTasksListFx.use(todoService.updateTasksList)
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
