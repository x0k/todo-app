import { Archive, Edit } from '@mui/icons-material'
import {
  Box,
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
  onEdit: () => void
  onArchive: () => void
}
export function TaskItem({
  task,
  secondary,
  onClick,
  onEdit,
  onArchive,
}: TaskItemProps): JSX.Element {
  return (
    <ListItem
      key={task.id}
      secondaryAction={
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton onClick={onArchive}>
            <Archive />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={onClick}>
        <ListItemText primary={task.title} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  )
}
