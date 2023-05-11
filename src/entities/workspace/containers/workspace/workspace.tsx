import { useStore } from 'effector-react/scope'

import { type Workspace } from '@/shared/kernel'
import { type FoldConfig, type Loadable, fold } from '@/shared/lib/state'

import { $workspace } from '../../model'

export interface WorkspaceContainerProps {
  render: FoldConfig<Loadable<Workspace, Error>, JSX.Element | null>
}

export function WorkspaceContainer({
  render,
}: WorkspaceContainerProps): JSX.Element | null {
  const ws = useStore($workspace)
  return fold(ws, render)
}
