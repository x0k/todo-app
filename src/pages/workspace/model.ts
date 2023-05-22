import { attach, sample } from 'effector'

import { $registryService, app } from '@/shared/app'
import { routes } from '@/shared/router'
import { type IStorageService } from '@/shared/storage'

declare module '@/shared/app' {
  interface Registry {
    workspacePageSettingsStorage: IStorageService<boolean>
  }
}

const d = app.createDomain('workspace-page')

export const $isEventsLogFeature = d.createStore(false)

export const featureToggled = d.createEvent()

const $workspacePageSettingsService = $registryService.map(
  async (r) => await r.workspacePageSettingsStorage()
)

const setIsEventsLogFeatureFx = attach({
  source: $workspacePageSettingsService,
  effect: async (settingsService, isEventsLogFeature: boolean) => {
    ;(await settingsService).save(isEventsLogFeature)
  },
})

const loadWorkspacePageSettingsFx = attach({
  source: $workspacePageSettingsService,
  effect: async (settingsService) => (await settingsService).load(),
})

$isEventsLogFeature
  .on(featureToggled, (state) => !state)
  .on(
    loadWorkspacePageSettingsFx.doneData,
    (_, isEventsLogFeature) => isEventsLogFeature
  )

sample({
  clock: routes.workspace.index.opened,
  target: loadWorkspacePageSettingsFx,
})

sample({
  clock: $isEventsLogFeature.updates,
  target: setIsEventsLogFeatureFx,
})
