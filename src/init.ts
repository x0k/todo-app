import { sample } from 'effector'

import { errorOccurred, started } from './common/app'
import { NotificationType, notificationShowed } from './features/notifications'
import { initNotifications } from './features/notifications/init'
import { type IToDoService } from './features/todo'
import { initToDo } from './features/todo/init'

export function initApp(todoService: IToDoService): void {
  initNotifications()
  initToDo(todoService)
  started()
}

sample({
  clock: errorOccurred,
  fn: ({ message }) => ({ type: NotificationType.Error, message }),
  target: notificationShowed,
})
