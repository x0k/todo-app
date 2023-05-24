import { Paper } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'

import { CreateTasksForm, type CreateTasksFormData } from '../../components'
import { $listsArray, createTasksFx, createTasksListFx } from '../../model'
import { $isOpen, statusChanged } from './model'

export function CreateTasksPanelContainer(): JSX.Element {
  const tasksLists = useStore($listsArray)
  const isOpen = useStore($isOpen)
  const binds = useUnit({ createTasksFx, createTasksListFx, statusChanged })
  async function handleSubmit({
    tasks,
    tasksList,
  }: CreateTasksFormData): Promise<unknown> {
    return await (typeof tasksList === 'string'
      ? binds.createTasksListFx({
          title: tasksList,
          tasks: tasks.map((t) => t.title),
        })
      : binds.createTasksFx({
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
        onTouched={binds.statusChanged}
      />
    </Paper>
  )
}
