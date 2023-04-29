import { Box, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

import { pluralize } from '@/shared/lib/intl'

import {
  EventType,
  type PositiveEvent,
  type Task,
  type TaskId,
  TaskStatus,
} from '@/entities/todo'

export interface PositiveEventProps {
  event: PositiveEvent
  tasks: Record<TaskId, Task>
}

export function PositiveEventComponent({
  event,
  tasks,
}: PositiveEventProps): JSX.Element {
  const ids =
    event.type === EventType.TaskStatusChanged ? [event.taskId] : event.tasksIds
  return (
    <Box>
      <Typography variant="overline">
        {formatDistanceToNow(event.createdAt, { addSuffix: true })}
      </Typography>
      {event.newStatus === TaskStatus.Archived ? (
        <Typography variant="subtitle1">
          You finalized round with {pluralize(ids.length, 'completed task')}
        </Typography>
      ) : (
        ids.map((id) => (
          <Typography key={id} variant="subtitle1">
            {tasks[id].title} is competed
          </Typography>
        ))
      )}
    </Box>
  )
}
