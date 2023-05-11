import { $listsArray } from '../../model'
import { isActualTasksList } from './core'

export const $actualTasksLists = $listsArray.map((lists) =>
  lists.filter(isActualTasksList)
)
