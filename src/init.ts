import { appStarted } from './common/app'
import { initNotifications } from './features/notifications/init'

export function init(): void {
  initNotifications()
  appStarted()
}
