import { List, Typography } from '@mui/material'
import { useStore } from 'effector-react/scope'

import { WorkspaceListItem } from '../../components'
import { $workspacesArray } from '../../model'

export function WorkspacesContainer(): JSX.Element | null {
  const workspaces = useStore($workspacesArray)
  return workspaces.length > 0 ? (
    <List>
      {workspaces.map((workspace) => (
        <WorkspaceListItem key={workspace.id} workspace={workspace} />
      ))}
    </List>
  ) : (
    <Typography padding={2}>No workspaces yet</Typography>
  )
}
