import {
  type Notification,
  type NotificationCreate,
  type NotificationId,
} from './model'

import { app } from '@/shared/app'

/* Notifications */

// Events

export const notificationShowed = app.createEvent<
  Notification | NotificationCreate
>()

export const notificationClosed = app.createEvent<NotificationId>()

export const notificationRemoved = app.createEvent<NotificationId>()

// Stores

export const $notifications = app.createStore<Notification[]>([])
