import { Box, Typography } from '@mui/material'
import { useStore } from 'effector-react/scope'

import { Loader } from '@/shared/components'
import { type TasksList } from '@/shared/kernel'
import { fold } from '@/shared/lib/state'

import { tasksListModel } from '@/entities/tasks-list'

import { ErrorMessage, ToWorkspace } from '@/widgets/error-message'
import { HeaderWidget } from '@/widgets/header'

interface ViewProps {
  tasksList: TasksList
}

function View({ tasksList }: ViewProps): JSX.Element {
  return (
    <Box
      flex="1 1 100%"
      maxWidth="xl"
      marginX="auto"
      gap={2}
      padding={2}
      marginBottom="72px"
    >
      <HeaderWidget
        title={<Typography variant="h4">{tasksList.title}</Typography>}
      />
    </Box>
  )
}

export function TasksListPage(): JSX.Element {
  const tasksList = useStore(tasksListModel.$tasksList)
  return fold(tasksList, {
    otherwise: () => <Loader />,
    error: ({ error }) => (
      <ErrorMessage message={error.message} action={<ToWorkspace />} />
    ),
    loaded: ({ data }) => <View tasksList={data} />,
  })
}
