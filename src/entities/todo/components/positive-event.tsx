import { Box, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { Fragment } from 'react'

import { pluralize } from '@/shared/lib/intl'

import {
  EventType,
  type PositiveEvent,
  type Task,
  type TaskId,
  TaskStatus,
  type TasksList,
  type TasksListId,
} from '@/entities/todo'

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
  const ids =
    event.type === EventType.TaskStatusChanged ? [event.taskId] : event.tasksIds
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {formatDistanceToNow(event.createdAt, { addSuffix: true })}
      </Typography>
      {event.newStatus === TaskStatus.Archived ? (
        <Typography variant="subtitle1">
          You finalized round with {pluralize(ids.length, 'completed task')}
        </Typography>
      ) : (
        ids.map((id) => (
          <Fragment key={id}>
            <Typography variant="subtitle1">{tasks[id].title} is competed</Typography>
            <Typography color="text.secondary">
              {lists[tasks[id].tasksListId].title}
            </Typography>
          </Fragment>
        ))
      )}
    </Box>
  )
}
