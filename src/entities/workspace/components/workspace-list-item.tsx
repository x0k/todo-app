import { ListItem, ListItemButton, ListItemText } from '@mui/material'
// @ts-expect-error wtf
import { Link } from 'atomic-router-react/scope'

import { BackendType, type Workspace } from '@/shared/kernel'
import { routes } from '@/shared/router'

export interface WorkspaceListItemProps {
  workspace: Workspace
  secondaryAction?: React.ReactNode
}

const BACKEND_TITLES: Record<BackendType, string> = {
  [BackendType.InMemory]: 'Demo',
  [BackendType.IndexedDatabase]: 'Local',
}

export function WorkspaceListItem({
  workspace,
  secondaryAction,
}: WorkspaceListItemProps): JSX.Element {
  return (
    <ListItem secondaryAction={secondaryAction} disablePadding>
      <ListItemButton
        component={Link}
        to={routes.workspace.index}
        params={{ workspaceId: workspace.id }}
      >
        <ListItemText
          primary={workspace.title}
          secondary={BACKEND_TITLES[workspace.backend.type]}
        />
      </ListItemButton>
    </ListItem>
  )
}
