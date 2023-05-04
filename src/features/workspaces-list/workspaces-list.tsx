import { List } from '@mui/material'

import { WorkspaceListItem, useWorkspaces } from '@/entities/workspace'

export function WorkspacesList(): JSX.Element {
  const workspaces = useWorkspaces()
  return (
    <List>
      {workspaces.map((workspace) => (
        <WorkspaceListItem
          key={workspace.id}
          workspace={workspace}
          onClick={console.log}
        />
      ))}
    </List>
  )
}
