import { Edit } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { type Task, type TaskId } from '../model'

export interface TasksProps {
  tasks: Task[]
  onClick: (id: TaskId) => void
  onEdit: (id: TaskId) => void
}

export function TasksComponent({
  tasks,
  onClick,
  onEdit,
}: TasksProps): JSX.Element {
  return (
    <List dense>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <IconButton
              onClick={() => {
                onEdit(task.id)
              }}
            >
              <Edit />
            </IconButton>
          }
        >
          <ListItemButton
            onClick={() => {
              onClick(task.id)
            }}
          >
            <ListItemText primary={task.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
