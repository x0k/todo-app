import { sample } from 'effector'

import { errorOccurred, started } from '@/common/app'

import { type IToDoService, reducer } from './model'

import {
  $tasksState,
  createTaskFx,
  createTasksFx,
  createTasksListFx,
  loadTasksStateFx,
  updateTaskFx,
  updateTasksListFx,
} from './domain'

export function initToDo(todoService: IToDoService): void {
  loadTasksStateFx.use(todoService.loadTasksState)
  createTaskFx.use(todoService.createTask)
  createTasksFx.use(todoService.createTasks)
  updateTaskFx.use(todoService.updateTask)
  createTasksListFx.use(todoService.createTasksList)
  updateTasksListFx.use(todoService.updateTasksList)
}

sample({
  clock: started,
  target: loadTasksStateFx,
})

sample({
  clock: [
    loadTasksStateFx.failData,
    createTaskFx.failData,
    createTasksFx.failData,
    updateTaskFx.failData,
    createTasksListFx.failData,
    updateTasksListFx.failData,
  ],
  target: errorOccurred,
})

$tasksState
  .on(loadTasksStateFx.doneData, (_, payload) => payload)
  .on(
    [
      createTaskFx.doneData,
      createTasksFx.doneData,
      updateTaskFx.doneData,
      createTasksListFx.doneData,
      updateTasksListFx.doneData,
    ],
    reducer
  )
