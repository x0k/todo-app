import { sample } from 'effector'

import { type IToDoService } from './domain/todo'

import { NotificationType, notificationShowed } from './features/notifications'
import { initNotifications } from './features/notifications/init'
import { initToDo } from './features/todo/init'
import { errorOccurred, started } from './shared/app'

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
