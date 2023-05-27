import { createDomain } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger'
import { type MemoizedFn } from 'memoize-one'

export const app = createDomain()

if (import.meta.env.DEV) {
  attachLogger()
}

export const appStarted = app.createEvent()

export const errorOccurred = app.createEvent<Error>()

// Registry

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Registry {}

export type IRegistryService = {
  [K in keyof Registry & keyof Config]: MemoizedFn<
    (args: Config[K]) => Promise<Registry[K]>
  >
}

export const $registryService = app.createStore({} as IRegistryService)
