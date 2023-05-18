import { TasksListId } from '@/shared/kernel'
import { ICodecService } from '@/shared/storage'

import { TasksListState } from '@/entities/tasks-list'
import { StorableToDoServiceState } from '@/entities/todo'

export function makeStorableToDoServiceStateToTasksListServiceCodec(
  tasksListId: TasksListId
): ICodecService<TasksListState, StorableToDoServiceState> {
  let lastState: StorableToDoServiceState | undefined
  return {
    decode(state) {
      lastState = state
      const tasksList = state.lists.get(tasksListId)
      if (tasksList === undefined) {
        throw new Error(`TasksList with id ${tasksListId} not found`)
      }
      return {
        tasks: state.tasks,
        tasksList,
      }
    },
    encode({ tasks, tasksList }) {
      if (lastState === undefined) {
        throw new Error('lastState is undefined')
      }
      return {
        tasks,
        events: lastState.events,
        lists: lastState.lists.set(tasksList.id, tasksList),
      }
    },
  }
}
