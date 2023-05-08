import { Box, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

import {
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'

import { type PositiveEvent } from './core'

export interface PositiveEventProps {
  event: PositiveEvent
  tasks: Record<TaskId, Task>
  lists: Record<TasksListId, TasksList>
}

export function PositiveEventComponent({
  event,
  tasks,
  lists,
}: PositiveEventProps): JSX.Element {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {formatDistanceToNow(event.createdAt, { addSuffix: true })}
      </Typography>
      <Typography variant="subtitle1">
        {tasks[event.taskId].title} is competed
      </Typography>
      <Typography color="text.secondary">
        {lists[tasks[event.taskId].tasksListId].title}
      </Typography>
      {event.message && (
        <Typography variant="body1">{event.message}</Typography>
      )}
    </Box>
  )
}
