import { app } from '@/shared/app'

const workspaceSettingsDialog = app.createDomain('workspace-settings-dialog')

export const $isOpen = workspaceSettingsDialog.createStore(false)

export const dialogOpened = workspaceSettingsDialog.createEvent()
export const dialogClosed = workspaceSettingsDialog.createEvent()

$isOpen.on(dialogOpened, () => true).on(dialogClosed, () => false)
