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

import { type TasksList } from '../model'

export interface TasksListProps {
  data: TasksList
  onClick: () => void
  onEdit: () => void
}

export function TasksListComponent({
  data,
  onClick,
  onEdit,
}: TasksListProps): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">{data.title}</Typography>
      <Paper elevation={2}>
        <List>
          {data.tasks.map((task) => (
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
          ))}
        </List>
      </Paper>
    </Box>
  )
}
