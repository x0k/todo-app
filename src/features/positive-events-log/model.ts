import { $events } from '@/entities/todo'

import { isPositiveEvent } from './core'

export const $positiveEvents = $events.map((events) =>
  events.filter(isPositiveEvent)
)
