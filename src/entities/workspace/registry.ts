import { defineService, singleton } from '@/shared/registry'

import { TestWorkspaceService } from './test-workspace-service'
import { type IWorkspaceService } from './types'

declare module '@/shared/registry' {
  interface Registry {
    workspaceService: IWorkspaceService
  }
}

defineService(
  'workspaceService',
  singleton(() => new TestWorkspaceService())
)
