import { useTasks } from '../hooks'
import { type Task, type TaskId } from '../types'

export interface TasksContainerProps {
  tasksIds: Iterable<TaskId>
  children: (tasks: Task[]) => JSX.Element
}

export function TasksContainer({
  tasksIds,
  children,
}: TasksContainerProps): JSX.Element {
  const tasks = useTasks(tasksIds)
  return children(tasks)
}
