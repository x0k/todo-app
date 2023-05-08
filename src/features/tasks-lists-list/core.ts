import { type TasksList } from '@/shared/kernel'

export function isActualTasksList(tasksList: TasksList): boolean {
  return !tasksList.isArchived
}
