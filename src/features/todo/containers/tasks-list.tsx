import { useStoreMap } from 'effector-react'

import { type TasksListId } from '../model'

import { $tasksMap } from '../domain'

export interface TasksListContainerProps {
  tasksListId: TasksListId
}

export function TasksListContainer({
  tasksListId,
}: TasksListContainerProps): JSX.Element | null {
  const data = useStoreMap({
    store: $tasksMap,
    keys: [tasksListId],
    fn: (map, [id]) => map.get(id),
  })
  if (data === undefined) {
    return null
  }
  return <h1>TasksList</h1>
}
