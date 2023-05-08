import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useStore } from 'effector-react/scope'

import { TaskStatus, type TasksList } from '@/shared/kernel'
import { pluralize } from '@/shared/lib/intl'

import { $actualTasksLists } from './model'

export interface TasksListsListProps {
  onClick: (list: TasksList) => void
}

export function TasksListsList({ onClick }: TasksListsListProps): JSX.Element {
  const lists = useStore($actualTasksLists)
  return lists.length ? (
    <List>
      {lists.map((list) => (
        <ListItem key={list.id} disablePadding>
          <ListItemButton
            onClick={() => {
              onClick(list)
            }}
          >
            <ListItemText
              primary={list.title}
              secondary={pluralize(
                list.tasks[TaskStatus.NotDone].size,
                'uncompleted task'
              )}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography>No lists</Typography>
  )
}
