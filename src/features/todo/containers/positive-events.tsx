import { useStore, useStoreMap } from 'effector-react'

import { type PositiveEvent, type Task, type TaskId } from '@/models/todo'

import { $positiveEvents, $tasksMap } from '../domain'

export interface PositiveEventsContainerRenderProps {
  events: PositiveEvent[]
  tasks: Record<TaskId, Task>
}

export interface PositiveEventsContainerProps {
  children: (props: PositiveEventsContainerRenderProps) => JSX.Element
}

export function PositiveEventsContainer({
  children,
}: PositiveEventsContainerProps): JSX.Element {
  const events = useStore($positiveEvents)
  const tasks = useStoreMap($tasksMap, (map) => Object.fromEntries(map))
  return children({ events, tasks })
}
