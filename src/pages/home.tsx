import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { TitledPanel } from '@/shared/components'
import { reverseMap } from '@/shared/lib/array'

import { CreateTasksContainer, PositiveEventComponent } from '@/entities/todo'
import {
  DashboardContainer,
  PositiveEventsContainer,
  type PositiveEventsContainerRenderProps,
} from '@/entities/todo'

import { HeaderWidget } from '@/widgets/header'

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
        <Typography variant="body1">No events</Typography>
      )}
    </Box>
  )
}

export function HomePage(): JSX.Element {
  return (
    <Box flex="1 1 100%" maxWidth="xl" marginX="auto" gap={2} padding={2}>
      <HeaderWidget />
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
