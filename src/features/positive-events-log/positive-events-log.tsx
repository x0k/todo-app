import { Box, Typography } from '@mui/material'
import { useStore, useStoreMap } from 'effector-react'

import { reverseMap } from '@/shared/lib/array'

import {
  $listsMap,
  $positiveEvents,
  $tasksMap,
  PositiveEventComponent,
} from '@/entities/todo'

export function PositiveEventsLog(): JSX.Element {
  const events = useStore($positiveEvents)
  const tasks = useStoreMap($tasksMap, (map) => Object.fromEntries(map))
  const lists = useStoreMap($listsMap, (map) => Object.fromEntries(map))
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {events.length > 0 ? (
        reverseMap(
          (event) => (
            <PositiveEventComponent
              key={event.createdAt.toString()}
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
