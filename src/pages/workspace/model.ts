import { attach, sample } from 'effector'

import { $registry, app, appStarted } from '@/shared/app'
import { type IStorageService } from '@/shared/storage'

declare module '@/shared/app' {
  interface Registry {
    workspacePageSettingsStorage: IStorageService<boolean>
  }
}

const d = app.createDomain('workspace-page')

export const $isEventsLogFeature = d.createStore(false)

export const featureToggled = d.createEvent()

const setIsEventsLogFeatureFx = attach({
  source: $registry,
  effect: (r, isEventsLogFeature: boolean) => {
    r.workspacePageSettingsStorage.save(isEventsLogFeature)
  },
})

$isEventsLogFeature.on(featureToggled, (state) => !state)

sample({
  clock: appStarted,
  source: $registry,
  fn: (r) => r.workspacePageSettingsStorage.load(),
  target: $isEventsLogFeature,
})

sample({
  clock: $isEventsLogFeature.updates,
  target: setIsEventsLogFeatureFx,
})
