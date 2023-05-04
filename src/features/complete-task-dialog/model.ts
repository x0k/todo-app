import { app } from '@/shared/app'
import { type Task } from '@/shared/kernel'

const d = app.createDomain('complete-task-dialog')

export const $currentTask = d.createStore<Task | null>(null)

export const open = d.createEvent<Task>()
export const close = d.createEvent()

$currentTask.on(open, (_, t) => t).on(close, () => null)
