import { useStore } from 'effector-react'
import { type VariantType, useSnackbar } from 'notistack'
import { useEffect, useRef } from 'react'

import { type NotificationId, NotificationType } from '@/domain/notification'

import { $notifications, notificationRemoved } from './domain'

const NOTIFICATION_TYPE_TO_STATUS_MAP: Record<NotificationType, VariantType> = {
  [NotificationType.Success]: 'success',
  [NotificationType.Error]: 'error',
  [NotificationType.Info]: 'info',
}

export function NotificationsContainer(): null {
  const notifications = useStore($notifications)
  const { current: displayed } = useRef(new Set<NotificationId>())
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  useEffect(() => {
    notifications.forEach(({ id, closed, message, type }) => {
      if (closed) {
        closeSnackbar(id)
        return
      }
      if (displayed.has(id)) {
        return
      }
      enqueueSnackbar(message, {
        key: id,
        variant: NOTIFICATION_TYPE_TO_STATUS_MAP[type],
        onExit: () => {
          notificationRemoved(id)
          displayed.delete(id)
        },
      })
      displayed.add(id)
    })
  }, [notifications, displayed, enqueueSnackbar, closeSnackbar])
  return null
}
