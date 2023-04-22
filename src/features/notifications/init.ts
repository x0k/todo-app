import { nanoid } from 'nanoid'

import { noop } from '@/lib/function'

import {
  $notifications,
  notificationClosed,
  notificationRemoved,
  notificationShowed,
} from './domain'

export const initNotifications = noop

$notifications
  .on(notificationShowed, (notifications, notification) =>
    notifications.concat({
      ...notification,
      id: 'id' in notification ? notification.id : nanoid(),
      closed: false,
    })
  )
  .on(notificationClosed, (notifications, id) =>
    notifications.map((n) => (n.id === id ? { ...n, closed: true } : n))
  )
  .on(notificationRemoved, (notifications, id) =>
    notifications.filter((n) => n.id !== id)
  )
