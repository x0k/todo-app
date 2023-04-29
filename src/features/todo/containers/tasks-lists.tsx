import { type TasksList } from '@/models/todo'

import { useTasksLists } from '../hooks'

export interface TasksListsContainerProps {
  children: (tasksLists: TasksList[]) => JSX.Element
}

export function TasksListsContainer({
  children,
}: TasksListsContainerProps): JSX.Element {
  const tasksLists = useTasksLists()
  return children(tasksLists)
}
