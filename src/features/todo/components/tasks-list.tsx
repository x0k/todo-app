import { Archive } from '@mui/icons-material'
import { IconButton } from '@mui/material'

import { TitledPanel } from '@/components/titled-panel'

import { type TasksList } from '../model'

import { updateTasksListFx } from '..'

export interface TasksListProps {
  tasksList: TasksList
  children: React.ReactNode
}

export function TasksListComponent({
  tasksList,
  children,
}: TasksListProps): JSX.Element {
  return (
    <TitledPanel
      title={tasksList.title}
      actions={
        <IconButton
          onClick={() => {
            updateTasksListFx({
              tasksListId: tasksList.id,
              change: { isArchived: true },
            })
          }}
        >
          <Archive />
        </IconButton>
      }
    >
      {children}
    </TitledPanel>
  )
}
