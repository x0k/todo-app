import { Check } from '@mui/icons-material'
import { Box, IconButton, List, Typography } from '@mui/material'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

import { TitledPanel } from '@/shared/components'
import { concat, map, take } from '@/shared/lib/iterable'

import {
  type TaskId,
  TaskItem,
  archiveTasksFx,
  completeTaskFx,
} from '@/entities/todo'

import { $dashboard, doneTasksArchiving } from './model'

function completeTask(taskId: TaskId): void {
  completeTaskFx({ taskId, message: '' })
}

function archiveTask(taskId: TaskId): void {
  archiveTasksFx({ tasksIds: [taskId] })
}

function archiveDoneTasks(): void {
  doneTasksArchiving()
}

export function DashboardContainer(): JSX.Element {
  const { doneTasks, notDoneTasks, tasksLists } = useStore($dashboard)
  const secondaryTexts = useMemo(
    () =>
      Object.fromEntries(
        take(
          doneTasks.length + notDoneTasks.length,
          map(
            (task) => [task.id, tasksLists.get(task.tasksListId)?.title ?? ''],
            concat(doneTasks, notDoneTasks)
          )
        )
      ),
    [doneTasks, notDoneTasks, tasksLists]
  ) as Record<TaskId, string>
  if (doneTasks.length === 0 && notDoneTasks.length === 0) {
    return <Typography variant="h5">No tasks found.</Typography>
  }
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {notDoneTasks.length > 0 && (
        <TitledPanel title="To Do" key="todo">
          <List>
            {notDoneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                secondary={secondaryTexts[task.id]}
                onClick={() => {
                  completeTask(task.id)
                }}
                onArchive={() => {
                  archiveTask(task.id)
                }}
              />
            ))}
          </List>
        </TitledPanel>
      )}
      {doneTasks.length > 0 && (
        <TitledPanel
          title="Completed"
          key="competed"
          actions={
            <IconButton onClick={archiveDoneTasks} sx={{ marginRight: 2 }}>
              <Check />
            </IconButton>
          }
        >
          <List>
            {doneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                secondary={secondaryTexts[task.id]}
                onClick={console.log}
              />
            ))}
          </List>
        </TitledPanel>
      )}
    </Box>
  )
}
