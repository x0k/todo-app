import { app } from '@/shared/app'

const d = app.createDomain('modal-panel')

export const $isOpen = d.createStore(false)

export const statusChanged = d.createEvent<boolean>()

export const opened = d.createEvent()
export const closed = d.createEvent()

$isOpen
  .on(opened, () => true)
  .on(closed, () => false)
  .on(statusChanged, (_, status) => status)
