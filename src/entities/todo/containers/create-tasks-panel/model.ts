import { todo } from '../../model'

const createTasksPanel = todo.createDomain('create-tasks-panel')

export const $isOpen = createTasksPanel.createStore(false)

export const statusChanged = createTasksPanel.createEvent<boolean>()

export const opened = createTasksPanel.createEvent()
export const closed = createTasksPanel.createEvent()

$isOpen
  .on(opened, () => true)
  .on(closed, () => false)
  .on(statusChanged, (_, status) => status)
