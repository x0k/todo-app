import { useStoreMap } from 'effector-react'

import { strictArrayComparator } from '@/common/utils'

import { $tasksLists } from '../domain'
import { type TasksListId } from '../model'

export interface TasksListsContainerProps {
  children: (listId: TasksListId) => JSX.Element
}

export function TasksListsContainer({
  children,
}: TasksListsContainerProps): JSX.Element {
  const tasksListsIds = useStoreMap({
    store: $tasksLists,
    keys: [],
    fn: (lists) => lists.map((list) => list.id),
    updateFilter: (prev, next) => strictArrayComparator(prev, next) !== 0,
  })
  return <>{tasksListsIds.map(children)}</>
}
