import { sample } from 'effector'

import { errorOccurred, started } from '@/common/app'

import { type IToDoService, TaskStatus, reducer } from './model'

import {
  $dashboard,
  $tasksState,
  changeTaskStatusFx,
  changeTasksStatusFx,
  createTaskFx,
  createTasksFx,
  createTasksListFx,
  doneTasksArchiving,
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
  changeTaskStatusFx.use(todoService.changeTaskStatus)
  changeTasksStatusFx.use(todoService.changeTasksStatus)
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
    changeTaskStatusFx.failData,
    changeTasksStatusFx.failData,
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
      changeTaskStatusFx.doneData,
      changeTasksStatusFx.doneData,
    ],
    reducer
  )

sample({
  clock: doneTasksArchiving,
  source: $dashboard,
  fn: ({ doneTasks }) => ({
    newStatus: TaskStatus.Archived,
    tasksIds: doneTasks.map((t) => t.id),
  }),
  target: changeTasksStatusFx,
})
