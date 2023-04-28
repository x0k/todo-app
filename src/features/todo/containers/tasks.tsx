import { type Task, type TaskId } from '@/domain/todo'

import { useTasks } from '../hooks'

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
