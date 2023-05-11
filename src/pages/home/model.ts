import { sample } from 'effector'

import { routes } from '@/shared/router'

import { loadWorkspacesFx } from '@/entities/workspace/model'

sample({
  clock: routes.home.opened,
  target: loadWorkspacesFx,
})
