import { nanoid } from 'nanoid'

import { app } from '@/shared/app'

import {
  type Notification,
  type NotificationCreate,
  type NotificationId,
} from '@/models/notification'

/* Notifications */

// Events

export const notificationShowed = app.createEvent<
  Notification | NotificationCreate
>()

export const notificationClosed = app.createEvent<NotificationId>()

export const notificationRemoved = app.createEvent<NotificationId>()

// Stores

export const $notifications = app.createStore<Notification[]>([])

// Init

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
