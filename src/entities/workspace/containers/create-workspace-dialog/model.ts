import { workspace } from '../../model'

const d = workspace.createDomain()

export const $isDialogOpen = d.createStore(false)

// Events

export const dialogOpened = d.createEvent()
export const dialogClosed = d.createEvent()

// Effects

// Init

$isDialogOpen.on(dialogOpened, () => true).on(dialogClosed, () => false)
