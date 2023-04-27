import { Box, List, Typography } from '@mui/material'
import { useStore } from 'effector-react'
import { useMemo } from 'react'

import { concat, map, take } from '@/lib/iterable'

import { TitledPanel } from '@/components/titled-panel'

import { type TaskId, TaskStatus } from '../model'

import { TaskItem } from '../components'

import { $dashboard, changeTaskStatusFx } from '../domain'

function completeTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.Done })
}

function reopenTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.NotDone })
}

function archiveTask(taskId: TaskId): void {
  changeTaskStatusFx({ taskId, newStatus: TaskStatus.Archived })
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
    return <Typography variant="h4">No tasks found.</Typography>
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
        <TitledPanel title="Completed" key="competed">
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
