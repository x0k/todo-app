import { Box, Paper, Typography } from '@mui/material'

import { type TasksList } from '../model'

export interface TasksListProps {
  tasksList: TasksList
  children: React.ReactNode
}

export function TasksListComponent({
  tasksList,
  children,
}: TasksListProps): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Typography variant="h6">{tasksList.title}</Typography>
      <Paper elevation={2}>{children}</Paper>
    </Box>
  )
}
