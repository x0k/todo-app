import { useTasksLists } from '../hooks'
import { type TasksList } from '../types'

export interface TasksListsContainerProps {
  children: (tasksLists: TasksList[]) => JSX.Element
}

export function TasksListsContainer({
  children,
}: TasksListsContainerProps): JSX.Element {
  const tasksLists = useTasksLists()
  return children(tasksLists)
}
