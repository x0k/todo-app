import { createDomain } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger/attach'

export const app = createDomain()
if (process.env.NODE_ENV === 'development') {
  attachLogger(app, {
    reduxDevtools: 'enabled',
    console: 'enabled',
    inspector: 'enabled'
  })
}

export const appStarted = app.createEvent()
