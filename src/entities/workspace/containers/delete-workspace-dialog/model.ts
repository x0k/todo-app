import { sample } from 'effector'

import { app } from '@/shared/app'
import { type WorkspaceId } from '@/shared/kernel'

import { deleteWorkspaceFx } from '../../model'

const deleteWorkspaceDialog = app.createDomain('delete-workspace-dialog')

export const $isOpen = deleteWorkspaceDialog.createStore<WorkspaceId | null>(
  null
)

export const dialogClosed = deleteWorkspaceDialog.createEvent()
export const dialogOpened = deleteWorkspaceDialog.createEvent<WorkspaceId>()

$isOpen.on(dialogClosed, () => null).on(dialogOpened, (_, id) => id)

sample({
  clock: deleteWorkspaceFx.done,
  source: $isOpen,
  filter: (id, { params }) => id === params.id,
  target: dialogClosed,
})
