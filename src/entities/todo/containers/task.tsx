import { useMemo } from 'react'

import { type Task, type TaskId, TaskStatus } from '@/entities/todo'

import { useTask } from '../hooks'
import { changeTaskStatusFx } from '../model'

export interface TaskContainerRenderProps {
  task: Task
  archiveTask: () => void
  completeTask: () => void
  reopenTask: () => void
}

export interface TaskContainerProps {
  taskId: TaskId
  children: (props: TaskContainerRenderProps) => JSX.Element
}

export function TaskContainer({
  children,
  taskId,
}: TaskContainerProps): JSX.Element | null {
  const task = useTask(taskId)
  const actions: Omit<TaskContainerRenderProps, 'task'> = useMemo(
    () => ({
      archiveTask: () => {
        changeTaskStatusFx({ taskId, newStatus: TaskStatus.Archived })
      },
      completeTask: () => {
        changeTaskStatusFx({ taskId, newStatus: TaskStatus.Done })
      },
      reopenTask: () => {
        changeTaskStatusFx({ taskId, newStatus: TaskStatus.NotDone })
      },
    }),
    [taskId]
  )
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return task ? children(Object.assign({ task }, actions)) : null
}
