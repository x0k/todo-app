import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { TitledPanel } from '@/shared/components'

import { DashboardContainer } from '@/entities/todo'

import { CreateTasksPanel } from '@/features/create-tasks-panel'
import { PositiveEventsLog } from '@/features/positive-events-log'

import { HeaderWidget } from '@/widgets/header'

export function HomePage(): JSX.Element {
  return (
    <Box
      flex="1 1 100%"
      maxWidth="xl"
      marginX="auto"
      gap={2}
      padding={2}
      marginBottom="72px"
    >
      <HeaderWidget />
      <Grid container spacing={4}>
        <Grid xs>
          <DashboardContainer />
        </Grid>
        <Grid xs>
          <TitledPanel title="Events">
            <Box padding={2}>
              <PositiveEventsLog />
            </Box>
          </TitledPanel>
        </Grid>
      </Grid>
      <CreateTasksPanel />
    </Box>
  )
}
