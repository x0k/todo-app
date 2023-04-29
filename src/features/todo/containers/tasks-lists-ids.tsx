import { type TasksListId } from '@/entities/todo'

import { useTasksListsIds } from '../hooks'

export interface TasksListsIdsContainerProps {
  children: (listsIds: TasksListId[]) => JSX.Element
}

export function TasksListsIdsContainer({
  children,
}: TasksListsIdsContainerProps): JSX.Element {
  const tasksListsIds = useTasksListsIds()
  return children(tasksListsIds)
}
