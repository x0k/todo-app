import { useTasksListsIds } from '../hooks'
import { type TasksListId } from '../types'

export interface TasksListsIdsContainerProps {
  children: (listsIds: TasksListId[]) => JSX.Element
}

export function TasksListsIdsContainer({
  children,
}: TasksListsIdsContainerProps): JSX.Element {
  const tasksListsIds = useTasksListsIds()
  return children(tasksListsIds)
}
