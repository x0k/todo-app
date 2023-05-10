import { Paper } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'

import {
  CreateTasksForm,
  type CreateTasksFormData,
  createTasksFx,
  createTasksListFx,
  useTasksLists,
  useWorkspaceId,
} from '@/entities/todo'

import { $isOpen, statusChanged } from './model'

export function CreateTasksPanel(): JSX.Element {
  const tasksLists = useTasksLists()
  const isOpen = useStore($isOpen)
  const handler = useUnit({ createTasksFx, createTasksListFx })
  const workspaceId = useWorkspaceId()
  async function handleSubmit({
    tasks,
    tasksList,
  }: CreateTasksFormData): Promise<unknown> {
    return await (typeof tasksList === 'string'
      ? handler.createTasksListFx({
          workspaceId,
          title: tasksList,
          tasks: tasks.map((t) => t.title),
        })
      : handler.createTasksFx({
          workspaceId,
          tasksListId: tasksList.id,
          tasks: tasks.map((t) => t.title),
        }))
  }

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
