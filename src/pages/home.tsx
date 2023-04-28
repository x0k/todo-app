import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { reverseMap } from '@/shared/lib/array'

import { TitledPanel } from '@/shared/components'

import {
  CreateTasksContainer,
  DashboardContainer,
  PositiveEventComponent,
  PositiveEventsContainer,
  type PositiveEventsContainerRenderProps,
} from '@/features/todo'

function renderPositiveEvents({
  events,
  tasks,
}: PositiveEventsContainerRenderProps): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" padding={2} gap={2}>
      {events.length > 0 ? (
        reverseMap(
          (event) => (
            <PositiveEventComponent
              key={event.createdAt.toString()}
              event={event}
              tasks={tasks}
            />
          ),
          events
        )
      ) : (
        <Typography variant="h6">No events</Typography>
      )}
    </Box>
  )
}

export function HomePage(): JSX.Element {
  return (
    <Box flex="1 1 100%" maxWidth="xl" marginX="auto" gap={2} padding={2}>
      <Grid container spacing={2}>
        <Grid xs>
          <DashboardContainer />
        </Grid>
        <Grid xs>
          <Box display="flex" flexDirection="column" gap={2}>
            <TitledPanel title="Create Tasks">
              <Box padding={2}>
                <CreateTasksContainer />
              </Box>
            </TitledPanel>
            <TitledPanel title="Recent events">
              <PositiveEventsContainer>
                {renderPositiveEvents}
              </PositiveEventsContainer>
            </TitledPanel>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
