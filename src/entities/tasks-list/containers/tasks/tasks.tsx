import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useStoreMap } from 'effector-react/scope'

import { type Task, type TaskStatus } from '@/shared/kernel'

import { $tasksListState } from '../../model'

export interface TasksContainerPops {
  taskStatus: TaskStatus
  onClick: (task: Task) => void
}

export function TasksContainer({
  taskStatus,
  onClick,
}: TasksContainerPops): JSX.Element | null {
  const tasks = useStoreMap({
    store: $tasksListState,
    keys: [taskStatus],
    fn: (state, [taskStatus]) =>
      state.type === 'loaded'
        ? Array.from(state.data.tasksList.tasks[taskStatus]).map(
            (taskId) => state.data.tasks.get(taskId) as Task
          )
        : [],
  })
  return tasks.length > 0 ? (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} disablePadding>
          <ListItemButton
            onClick={() => {
              onClick(task)
            }}
            disableRipple
          >
            <ListItemText primary={task.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography padding={2}>No tasks</Typography>
  )
}
