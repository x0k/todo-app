import {
  type AbstractEvent,
  type Event,
  EventType,
} from '@/entities/todo'

export type PositiveEventType =
  | EventType.TaskCompleted
  | EventType.TasksArchived

export type PositiveEvent = Extract<Event, AbstractEvent<PositiveEventType>>

export function isPositiveEvent(event: Event): event is PositiveEvent {
  return (
    event.type === EventType.TaskCompleted ||
    event.type === EventType.TasksArchived
  )
}
