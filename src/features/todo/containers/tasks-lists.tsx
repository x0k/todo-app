import { useStoreMap } from 'effector-react'

import { strictArrayComparator } from '@/common/utils'

import { type TasksListId } from '../model'

import { $tasksState } from '../domain'

export interface TasksListsContainerProps {
  children: (listId: TasksListId) => JSX.Element
}

export function TasksListsContainer({
  children,
}: TasksListsContainerProps): JSX.Element {
  const tasksListsIds = useStoreMap({
    store: $tasksState,
    keys: [],
    fn: (state) => Array.from(state.lists.keys()),
    updateFilter: (prev, next) => strictArrayComparator(prev, next) !== 0,
  })
  return <>{tasksListsIds.map(children)}</>
}
