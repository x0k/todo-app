import { Box, Typography } from '@mui/material'
import { useStore } from 'effector-react'

import { TitledPanel } from '@/components/titled-panel'

import { TasksComponent } from '../components'

import { $dashboard } from '../domain'

export function DashboardContainer(): JSX.Element {
  const { doneTasks, notDoneTasks } = useStore($dashboard)
  if (doneTasks.length === 0 && notDoneTasks.length === 0) {
    return <Typography variant="h4">No tasks found.</Typography>
  }
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {notDoneTasks.length > 0 && (
        <TitledPanel title="To Do">
          <TasksComponent
            tasks={notDoneTasks}
            onClick={console.log}
            onEdit={console.log}
          />
        </TitledPanel>
      )}

      {doneTasks.length > 0 && (
        <TitledPanel title="Completed">
          <TasksComponent
            tasks={doneTasks}
            onClick={console.log}
            onEdit={console.log}
          />
        </TitledPanel>
      )}
    </Box>
  )
}
