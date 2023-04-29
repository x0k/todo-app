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
