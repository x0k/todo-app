import { createQuery } from '@farfetched/core'
import { sample } from 'effector'

import { routes } from '@/shared/routes'

import { createWorkspaceFx, loadWorkspaceFx } from '@/entities/workspace/model'

export const workspaceQuery = createQuery({
  handler: loadWorkspaceFx,
})

sample({
  clock: routes.workspace.opened,
  fn: ({ params: { workspaceId } }) => workspaceId,
  target: workspaceQuery.start,
})

sample({
  clock: createWorkspaceFx.doneData,
  fn: (workspace) => ({ workspaceId: workspace.id }),
  target: routes.workspace.open,
})
