import { type TasksList, type TasksListId } from '../model'

import { useTasksList } from '../hooks'

export interface TasksListContainerProps {
  tasksListId: TasksListId
  children: (data: TasksList) => JSX.Element | null
}

export function TasksListContainer({
  tasksListId,
  children,
}: TasksListContainerProps): JSX.Element | null {
  const tasksList = useTasksList(tasksListId)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return tasksList ? children(tasksList) : null
}
