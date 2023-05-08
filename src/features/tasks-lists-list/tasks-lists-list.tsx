import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useStore } from 'effector-react/scope'

import { type TasksList } from '@/shared/kernel'
import { pluralize } from '@/shared/lib/intl'

import { $listsArray } from '@/entities/todo'

export interface TasksListsListProps {
  onClick: (list: TasksList) => void
}

export function TasksListsList({ onClick }: TasksListsListProps): JSX.Element {
  const lists = useStore($listsArray)
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
              secondary={pluralize(list.tasksCount, 'task')}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography>No lists</Typography>
  )
}
