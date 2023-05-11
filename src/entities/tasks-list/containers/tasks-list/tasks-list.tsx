import { useStore } from 'effector-react/scope'

import { type TasksList } from '@/shared/kernel'
import { type FoldConfig, type Loadable, fold } from '@/shared/lib/state'

import { $tasksList } from '../../model'

export interface TasksListContainerProps {
  render: FoldConfig<Loadable<TasksList, Error>, JSX.Element | null>
}

export function TasksListContainer({
  render,
}: TasksListContainerProps): JSX.Element | null {
  const tasksList = useStore($tasksList)
  return fold(tasksList, render)
}
