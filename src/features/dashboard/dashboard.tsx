import { Check } from '@mui/icons-material'
import { Box, IconButton, List, Typography } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'
import { useMemo } from 'react'

import { TitledPanel } from '@/shared/components'
import { type Task, type TaskId } from '@/shared/kernel'
import { concat, map, take } from '@/shared/lib/iterable'

import { TaskItem, archiveTasksFx } from '@/entities/todo'

import { $dashboard, doneTasksArchiving } from './model'

function archiveTask(taskId: TaskId): void {
  archiveTasksFx({ tasksIds: [taskId] })
}

export interface DashboardProps {
  onUnDoneTaskClick: (task: Task) => void
  onDoneTaskClick: (task: Task) => void
}

export function Dashboard({
  onUnDoneTaskClick,
  onDoneTaskClick,
}: DashboardProps): JSX.Element {
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
  const archiveDoneTasks = useUnit(doneTasksArchiving)
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TitledPanel title="To Do" key="todo">
        {notDoneTasks.length > 0 ? (
          <List>
            {notDoneTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                secondary={secondaryTexts[task.id]}
                onClick={() => {
                  onUnDoneTaskClick(task)
                }}
                onArchive={() => {
                  archiveTask(task.id)
                }}
              />
            ))}
          </List>
        ) : (
          <Box padding={2}>
            <Typography variant="body1">No uncompleted tasks</Typography>
          </Box>
        )}
      </TitledPanel>
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
                onClick={() => {
                  onDoneTaskClick(task)
                }}
              />
            ))}
          </List>
        </TitledPanel>
      )}
    </Box>
  )
}
