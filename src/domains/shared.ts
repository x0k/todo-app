import { createDomain } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger/attach'

export const app = createDomain('app')

if (process.env.NODE_ENV === 'development') {
  attachLogger(app, {
    console: 'enabled'
  })
}

export const appStarted = app.createEvent()
