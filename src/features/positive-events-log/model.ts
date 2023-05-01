import { $events } from '@/entities/todo'

import { isPositiveEvent } from './types'

export const $positiveEvents = $events.map((events) =>
  events.filter(isPositiveEvent)
)
