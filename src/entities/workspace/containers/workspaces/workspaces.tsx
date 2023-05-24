import { Delete } from '@mui/icons-material'
import { IconButton, List, Typography } from '@mui/material'
import { useStore } from 'effector-react/scope'

import { type Workspace } from '@/shared/kernel'

import { WorkspaceListItem } from '../../components'
import { $workspacesArray } from '../../model'

export interface WorkspacesContainerProps {
  onDelete: (workspace: Workspace) => void
}

export function WorkspacesContainer({
  onDelete,
}: WorkspacesContainerProps): JSX.Element | null {
  const workspaces = useStore($workspacesArray)
  return workspaces.length > 0 ? (
    <List>
      {workspaces.map((workspace) => (
        <WorkspaceListItem
          key={workspace.id}
          workspace={workspace}
          secondaryAction={
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                onDelete(workspace)
              }}
              color="error"
            >
              <Delete />
            </IconButton>
          }
        />
      ))}
    </List>
  ) : (
    <Typography padding={2}>No workspaces yet</Typography>
  )
}
