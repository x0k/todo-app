import { Box, Typography } from '@mui/material'
import { useStore } from 'effector-react/scope'

import { reverseMap } from '@/shared/lib/array'

import { $listsRecord, $tasksRecord } from '@/entities/todo'

import { $positiveEvents } from './model'
import { PositiveEventComponent } from './positive-event'

export function PositiveEventsLog(): JSX.Element {
  const events = useStore($positiveEvents)
  const lists = useStore($listsRecord)
  const tasks = useStore($tasksRecord)
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {events.length > 0 ? (
        reverseMap(
          (event) => (
            <PositiveEventComponent
              key={event.createdAt.getTime()}
              event={event}
              tasks={tasks}
              lists={lists}
            />
          ),
          events
        )
      ) : (
        <Typography variant="body1">No events</Typography>
      )}
    </Box>
  )
}
