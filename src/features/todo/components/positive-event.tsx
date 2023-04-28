import { Box, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'

import { pluralize } from '@/shared/lib/intl'

import {
  EventType,
  type PositiveEvent,
  type Task,
  type TaskId,
  TaskStatus,
} from '@/domain/todo'

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
      <Box display="flex" alignItems="baseline">
        <Typography variant="h6">
          {event.newStatus === TaskStatus.Archived
            ? `You finalize round with ${ids.length} completed tasks`
            : `You completed ${pluralize(ids.length, 'task')}`}
        </Typography>
        <Box flexGrow={1} />
        <Typography variant="overline">
          {formatDistanceToNow(event.createdAt, { addSuffix: true })}
        </Typography>
      </Box>
      {ids.map((id) => (
        <Typography key={id}>{tasks[id].title}</Typography>
      ))}
    </Box>
  )
}
