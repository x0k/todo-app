import { Box, Typography } from '@mui/material'

import {
  EventType,
  type PositiveEvent,
  type Task,
  type TaskId,
  TaskStatus,
} from '../model'

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
      <Typography variant="h6">{event.createdAt.toLocaleString()}</Typography>
      {event.newStatus === TaskStatus.Archived ? (
        <Typography>
          You finalize round with {ids.length} completed tasks
        </Typography>
      ) : (
        ids.map((id) => (
          <Typography key={id}>Task completed: {tasks[id].title}</Typography>
        ))
      )}
    </Box>
  )
}
