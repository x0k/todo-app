import { Box, Typography } from '@mui/material'
import { useStore } from 'effector-react'

import { reverseMap } from '@/shared/lib/array'

import { $lists, $tasks } from '@/entities/todo'

import { $positiveEvents } from './model'
import { PositiveEventComponent } from './positive-event'

export function PositiveEventsLog(): JSX.Element {
  const events = useStore($positiveEvents)
  const lists = useStore($lists)
  const tasks = useStore($tasks)
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
