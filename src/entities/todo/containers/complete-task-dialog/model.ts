import { type Task } from '@/shared/kernel'

import { todo } from '../../model'

const completeTaskDialog = todo.createDomain('complete-task-dialog')

export const $currentTask = completeTaskDialog.createStore<Task | null>(null)

export const dialogOpened = completeTaskDialog.createEvent<Task>()
export const dialogClosed = completeTaskDialog.createEvent()

$currentTask.on(dialogOpened, (_, t) => t).on(dialogClosed, () => null)
