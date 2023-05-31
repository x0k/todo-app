import { createDomain } from 'effector'
import { type MemoizedFn } from 'memoize-one'

export const app = createDomain()

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
