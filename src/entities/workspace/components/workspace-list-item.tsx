import { ListItem, ListItemButton, ListItemText } from '@mui/material'

import { type Workspace } from '@/shared/kernel'

export interface WorkspaceListItemProps {
  workspace: Workspace
  onClick: () => void
  secondaryAction?: React.ReactNode
}

export function WorkspaceListItem({
  workspace,
  secondaryAction,
  onClick,
}: WorkspaceListItemProps): JSX.Element {
  return (
    <ListItem
      key={workspace.id}
      secondaryAction={secondaryAction}
      disablePadding
    >
      <ListItemButton onClick={onClick}>
        <ListItemText primary={workspace.title} />
      </ListItemButton>
    </ListItem>
  )
}
