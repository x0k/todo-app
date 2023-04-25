import { Edit } from '@mui/icons-material'
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { type Task } from '../model'

export interface TaskItemProps {
  task: Task
  onClick: () => void
  onEdit: () => void
}
export function TaskItem({
  task,
  onClick,
  onEdit,
}: TaskItemProps): JSX.Element {
  return (
    <ListItem
      key={task.id}
      secondaryAction={
        <IconButton onClick={onEdit}>
          <Edit />
        </IconButton>
      }
    >
      <ListItemButton onClick={onClick}>
        <ListItemText primary={task.title} />
      </ListItemButton>
    </ListItem>
  )
}
