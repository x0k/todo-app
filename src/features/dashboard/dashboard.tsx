import { CheckBox, CheckBoxOutlineBlank, DoneAll } from '@mui/icons-material'
import { Box, IconButton, List, Typography } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'
import { useMemo } from 'react'

import { TitledPanel } from '@/shared/components'
import { type Task, type TaskId } from '@/shared/kernel'
import { concat, map, take } from '@/shared/lib/iterable'

import { TaskItem, archiveTasksFx } from '@/entities/todo'

import { $dashboard, doneTasksArchiving } from './model'

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
  const handlers = useUnit({ doneTasksArchiving, archiveTasksFx })
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TitledPanel
        title={
          <>
            <CheckBoxOutlineBlank />
            To Do
          </>
        }
        key="todo"
      >
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
                  handlers.archiveTasksFx({ tasksIds: [task.id] })
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
          title={
            <>
              <CheckBox />
              Completed
            </>
          }
          key="competed"
          actions={
            <IconButton
              onClick={handlers.doneTasksArchiving}
              sx={{ marginRight: 2 }}
            >
              <DoneAll />
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
