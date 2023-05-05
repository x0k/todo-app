import { List } from '@mui/material'

import { WorkspaceListItem, useWorkspaces } from '@/entities/workspace'

export function WorkspacesList(): JSX.Element | null {
  const workspaces = useWorkspaces()
  return workspaces.length > 0 ? (
    <List>
      {workspaces.map((workspace) => (
        <WorkspaceListItem key={workspace.id} workspace={workspace} />
      ))}
    </List>
  ) : null
}
