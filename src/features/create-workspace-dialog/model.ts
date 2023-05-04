import { app } from '@/shared/app'

const d = app.createDomain()

export const $isOpen = d.createStore(false)

// Events

export const open = d.createEvent()
export const close = d.createEvent()

// Effects

// Init

$isOpen.on(open, () => true).on(close, () => false)
