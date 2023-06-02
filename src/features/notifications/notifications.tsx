import { useStore, useUnit } from 'effector-react/scope'
import { type VariantType, useSnackbar } from 'notistack'
import { useEffect, useRef } from 'react'

import { type NotificationId, NotificationType } from './core'
import { $notifications, notificationRemoved } from './model'

const NOTIFICATION_TYPE_TO_STATUS_MAP: Record<NotificationType, VariantType> = {
  [NotificationType.Success]: 'success',
  [NotificationType.Error]: 'error',
  [NotificationType.Info]: 'info',
}

export function Notifications(): null {
  const notifications = useStore($notifications)
  const { current: displayed } = useRef(new Set<NotificationId>())
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const removeNotification = useUnit(notificationRemoved)
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
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        preventDuplicate: true,
        onExit: () => {
          removeNotification(id)
          displayed.delete(id)
        },
      })
      displayed.add(id)
    })
  }, [notifications, displayed, enqueueSnackbar, closeSnackbar])
  return null
}
