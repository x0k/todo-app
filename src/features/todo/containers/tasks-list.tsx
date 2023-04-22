import { useStoreMap } from 'effector-react'

import { type TasksList, type TasksListId } from '../model'

import { $tasksMap } from '../domain'

export interface TasksListContainerProps {
  tasksListId: TasksListId
  children: (data: TasksList) => JSX.Element
}

export function TasksListContainer({
  tasksListId,
  children
}: TasksListContainerProps): JSX.Element | null {
  const data = useStoreMap({
    store: $tasksMap,
    keys: [tasksListId],
    fn: (map, [id]) => map.get(id),
  })
  if (data === undefined) {
    return null
  }
  return children(data)
}
