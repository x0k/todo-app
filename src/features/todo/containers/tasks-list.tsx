import { useStoreMap } from 'effector-react'

import {
  type Task,
  TaskStatus,
  type TasksList,
  type TasksListId,
} from '../model'

import { $tasksState } from '../domain'

export interface TasksListData {
  list: TasksList
  tasks: Task[]
}

export interface TasksListContainerProps {
  tasksListId: TasksListId
  children: (data: TasksListData) => JSX.Element
}

export function TasksListContainer({
  tasksListId,
  children,
}: TasksListContainerProps): JSX.Element | null {
  const data = useStoreMap({
    store: $tasksState,
    keys: [tasksListId],
    fn: ({ tasks, lists }, [id]): TasksListData | null => {
      const list = lists.get(id)
      if (list === undefined) {
        return null
      }
      const listTasks: Task[] = []
      for (const taskId of list.tasks[TaskStatus.NotDone]) {
        const task = tasks.get(taskId)
        if (task !== undefined) {
          listTasks.push(task)
        }
      }
      return { list, tasks: listTasks }
    },
  })
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return data && children(data)
}
