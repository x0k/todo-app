import { type TasksListId } from '../model'

import { useTasksLists } from '../hooks'

export interface TasksListsContainerProps {
  children: (listsIds: TasksListId[]) => JSX.Element
}

export function TasksListsContainer({
  children,
}: TasksListsContainerProps): JSX.Element {
  const tasksListsIds = useTasksLists()
  return children(tasksListsIds)
}
