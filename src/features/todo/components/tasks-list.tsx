import { Edit } from '@mui/icons-material'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import { type Task, type TaskId } from '../model'

export interface TasksListProps {
  title: string
  tasks: Task[]
  onClick: (taskId: TaskId) => void
  onEdit: (taskId: TaskId) => void
}

export function TasksListComponent({
  title,
  tasks,
  onClick,
  onEdit,
}: TasksListProps): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">{title}</Typography>
      <Paper elevation={2}>
        <List>
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
      </Paper>
    </Box>
  )
}
