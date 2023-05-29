import { type HistoryPushParams } from 'atomic-router'
import { attach, sample } from 'effector'

import { $registryService, appStarted } from '@/shared/app'
import { type IStorageService } from '@/shared/lib/storage'
import { router } from '@/shared/router'

import { type PersistentLocation } from './core'

declare module '@/shared/app' {
  interface Registry {
    locationStorage: IStorageService<PersistentLocation>
  }
}

const saveLocationFx = attach({
  source: $registryService,
  effect: async (r, location: PersistentLocation) => {
    ;(await r.locationStorage()).save(location)
  },
})

const loadLocationFx = attach({
  source: $registryService,
  effect: async (r) => (await r.locationStorage()).load(),
})

sample({
  clock: appStarted,
  target: loadLocationFx,
})

sample({
  clock: loadLocationFx.doneData,
  fn: ({ path, query }): Omit<HistoryPushParams, 'history'> => ({
    path,
    query,
    params: {},
    method: 'replace',
  }),
  target: router.push,
})

sample({
  source: {
    path: router.$path,
    query: router.$query,
  },
  target: saveLocationFx,
})
