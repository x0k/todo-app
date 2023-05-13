import { createDomain } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger'

export const app = createDomain()
if (process.env.NODE_ENV === 'development') {
  attachLogger()
}

export const appStarted = app.createEvent()

export const errorOccurred = app.createEvent<Error>()

// Registry

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Registry {}

export const $registry = app.createStore({} as Registry)
