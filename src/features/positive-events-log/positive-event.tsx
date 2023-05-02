import { Box, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

import { pluralize } from '@/shared/lib/intl'

import {
  EventType,
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from '@/entities/todo'

import { type PositiveEvent } from './types'

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
      {event.type === EventType.TasksArchived ? (
        <Typography variant="subtitle1">
          You finalized round with{' '}
          {pluralize(event.tasksIds.length, 'completed task')}
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle1">
            {tasks[event.taskId].title} is competed
          </Typography>
          <Typography color="text.secondary">
            {lists[tasks[event.taskId].tasksListId].title}
          </Typography>
          <Typography variant="body1">
            {event.message}
          </Typography>
        </>
      )}
    </Box>
  )
}
