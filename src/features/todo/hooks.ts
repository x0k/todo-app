import { useStoreMap } from 'effector-react'

import { isArrayNotEqual } from '@/shared/utils'

import {
  type Task,
  type TaskId,
  type TasksList,
  type TasksListId,
} from './model'

import { $listsMap, $tasksMap, $tasksState } from './domain'

export function useTasks(taskIds: Iterable<TaskId>): Task[] {
  return useStoreMap({
    store: $tasksMap,
    keys: [taskIds],
    fn: (tasksMap, [taskIds]) => {
      const tasks: Task[] = []
      for (const taskId of taskIds) {
        const task = tasksMap.get(taskId)
        if (task !== undefined) {
          tasks.push(task)
        }
      }
      return tasks
    },
  })
}

export function useTasksListsIds(): TasksListId[] {
  return useStoreMap({
    store: $tasksState,
    keys: [],
    fn: (state) => Array.from(state.lists.keys()),
    updateFilter: isArrayNotEqual,
  })
}

export function useTasksList(tasksListId: TasksListId): TasksList | undefined {
  return useStoreMap({
    store: $listsMap,
    keys: [tasksListId],
    fn: (lists, [id]) => lists.get(id),
  })
}

export function useTask(taskId: TaskId): Task | undefined {
  return useStoreMap({
    store: $tasksMap,
    keys: [taskId],
    fn: (tasks, [id]) => tasks.get(id),
  })
}

export function useTasksLists(): TasksList[] {
  return useStoreMap({
    store: $listsMap,
    keys: [],
    fn: (lists) => Array.from(lists.values()),
  })
}
