import { sample } from 'effector'
import { createGate } from 'effector-react/scope'

import { app } from '@/shared/app'

import { $events, loadEventsFx } from '@/entities/todo'

import { isPositiveEvent } from './core'

const d = app.createDomain('positive-events-log')

export const EventsGate = createGate({ domain: d })

export const $page = d.createStore(1)

export const $positiveEvents = $events.map((events) =>
  events.filter(isPositiveEvent)
)

$page.reset(EventsGate.close)

// TODO: Use react query or something like it
// to implement infinite scroll
sample({
  clock: [EventsGate.open, $page.updates],
  source: { page: $page },
  target: loadEventsFx,
})
