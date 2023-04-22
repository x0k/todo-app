import { sample } from 'effector'

import { errorOccurred, started } from './common/app'
import { NotificationType, notificationShowed } from './features/notifications'
import { initNotifications } from './features/notifications/init'
import { type ToDoHandlers } from './features/todo'
import { initToDo } from './features/todo/init'

export function initApp(todoHandlers: ToDoHandlers): void {
  initNotifications()
  initToDo(todoHandlers)
  started()
}

sample({
  clock: errorOccurred,
  fn: ({ message }) => ({ type: NotificationType.Error, message }),
  target: notificationShowed,
})
