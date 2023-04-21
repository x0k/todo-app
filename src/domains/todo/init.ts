import {
  type ToDoHandlers,
  createTaskFx,
  createTasksListFx,
  loadTasksListsFx,
  updateTaskFx,
  updateTasksListFx,
} from './index'

export function initToDo(handlers: ToDoHandlers): void {
  loadTasksListsFx.use(handlers.loadTasksLists)
  createTaskFx.use(handlers.createTask)
  updateTaskFx.use(handlers.updateTask)
  createTasksListFx.use(handlers.createTasksList)
  updateTasksListFx.use(handlers.updateTasksList)
}
