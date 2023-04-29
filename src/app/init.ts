import { sample } from 'effector'

import { notificationShowed } from '../features/notifications'
import { NotificationType } from '../models/notification'
import { errorOccurred, started } from '../shared/app'

sample({
  clock: errorOccurred,
  fn: ({ message }) => ({ type: NotificationType.Error, message }),
  target: notificationShowed,
})

started()
