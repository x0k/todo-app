import { $listsArray } from '@/entities/todo'

import { isActualTasksList } from './core'

export const $actualTasksLists = $listsArray.map((lists) =>
  lists.filter(isActualTasksList)
)
