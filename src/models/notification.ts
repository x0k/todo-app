export type NotificationId = string

export enum NotificationType {
  Info = 'info',
  Error = 'error',
  Success = 'success',
}

export interface Notification {
  id: NotificationId
  type: NotificationType
  message: string
  closed: boolean
}

export type NotificationCreate = Omit<Notification, 'id' | 'closed'>
