import { Archive, Edit } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

import { TitledPanel } from '@/components/titled-panel'

import { type TasksList } from '../model'

export interface TasksListProps {
  tasksList: TasksList
  children: React.ReactNode
  onArchive: () => void
  onEdit: () => void
}

export function TasksListComponent({
  tasksList,
  children,
  onArchive,
  onEdit,
}: TasksListProps): JSX.Element {
  return (
    <TitledPanel
      title={tasksList.title}
      actions={
        <Box display="flex" alignItems="center" gap={1} paddingRight={2}>
          <IconButton onClick={onEdit}>
            <Edit />
          </IconButton>
          <IconButton onClick={onArchive}>
            <Archive />
          </IconButton>
        </Box>
      }
    >
      {children}
    </TitledPanel>
  )
}
