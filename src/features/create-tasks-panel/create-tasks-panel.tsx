import { Paper } from '@mui/material'
import { useStore } from 'effector-react'

import {
  CreateTasksForm,
  type CreateTasksFormData,
  createTasksFx,
  createTasksListFx,
  useTasksLists,
} from '@/entities/todo'

import { $isOpen, statusChanged } from './model'

function handleSubmit({ tasks, tasksList }: CreateTasksFormData): void {
  if (typeof tasksList === 'string') {
    createTasksListFx({
      title: tasksList,
      tasks: tasks.map((t) => t.title),
    })
  } else {
    createTasksFx({
      tasksListId: tasksList.id,
      tasks: tasks.map((t) => t.title),
    })
  }
}

export function CreateTasksPanel(): JSX.Element {
  const tasksLists = useTasksLists()
  const isOpen = useStore($isOpen)
  return (
    <Paper
      sx={{
        ...(isOpen
          ? { bottom: 0 }
          : {
              top: `calc(100% - 72px)`,
            }),
        position: 'fixed',
        left: 16,
        right: 16,
        maxWidth: '1520px',
        marginX: 'auto',
        padding: '16px',
      }}
      elevation={2}
    >
      <CreateTasksForm
        tasksLists={tasksLists}
        onSubmit={handleSubmit}
        onTouched={statusChanged}
      />
    </Paper>
  )
}
