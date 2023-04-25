import { type Task, type TaskId } from '../model'

import { useTask } from '../hooks'

export interface TaskContainerProps {
  taskId: TaskId
  children: (task: Task) => JSX.Element
}

export function TaskContainer({
  children,
  taskId,
}: TaskContainerProps): JSX.Element | null {
  const task = useTask(taskId)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return task ? children(task) : null
}
