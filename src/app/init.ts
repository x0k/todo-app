import { sample } from 'effector'

import { errorOccurred, appStarted } from '@/shared/app'

import { NotificationType, notificationShowed } from '@/features/notifications'

sample({
  clock: errorOccurred,
  fn: ({ message }) => ({ type: NotificationType.Error, message }),
  target: notificationShowed,
})

appStarted()
