import { type AbstractEvent, type Event, EventType, TaskStatus } from '@/entities/todo'

export type PositiveEventType =
  | EventType.TaskStatusChanged
  | EventType.TasksStatusChanged

export type PositiveEvent = Extract<Event, AbstractEvent<PositiveEventType>>

export function isPositiveEvent(event: Event): event is PositiveEvent {
  return (
    (event.type === EventType.TaskStatusChanged &&
      event.newStatus === TaskStatus.Done) ||
    (event.type === EventType.TasksStatusChanged &&
      (event.newStatus === TaskStatus.Done ||
        event.newStatus === TaskStatus.Archived))
  )
}
