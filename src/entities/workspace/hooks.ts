import { useStore } from 'effector-react/scope'

import { type Workspace } from '@/shared/kernel'

import { $workspaces } from './model'

export function useWorkspaces(): Workspace[] {
  return useStore($workspaces)
}
