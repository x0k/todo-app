import { Archive } from '@mui/icons-material'
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { type ReactNode } from 'react'

import { type Task } from '@/entities/todo'

export interface TaskItemProps {
  task: Task
  secondary?: ReactNode
  onClick: () => void
  onArchive: () => void
}
export function TaskItem({
  task,
  secondary,
  onClick,
  onArchive,
}: TaskItemProps): JSX.Element {
  return (
    <ListItem
      key={task.id}
      sx={{
        '& .task-secondary-action': { visibility: 'hidden' },
        '&:hover': { '& .task-secondary-action': { visibility: 'visible' } },
      }}
      secondaryAction={
        <IconButton className="task-secondary-action" onClick={onArchive}>
          <Archive />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton onClick={onClick} >
        <ListItemText primary={task.title} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  )
}
