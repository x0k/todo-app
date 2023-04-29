import { Archive } from '@mui/icons-material'
import { Box, IconButton, List, Typography } from '@mui/material'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

import { TitledPanel } from '@/shared/components'
import { concat, map, take } from '@/shared/lib/iterable'

import { TaskItem } from '../components'
import { $dashboard, changeTaskStatusFx, doneTasksArchiving } from '../model'
import { type TaskId, TaskStatus } from '../types'

function completeTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.Done })
}

function reopenTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.NotDone })
}

function archiveTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.Archived })
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
          <List dense>
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
                onEdit={console.log}
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
              <Archive />
            </IconButton>
          }
        >
          <List dense>
            {doneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                secondary={secondaryTexts[task.id]}
                onClick={() => {
                  reopenTask(task.id)
                }}
                onArchive={() => {
                  archiveTask(task.id)
                }}
                onEdit={console.log}
              />
            ))}
          </List>
        </TitledPanel>
      )}
    </Box>
  )
}
