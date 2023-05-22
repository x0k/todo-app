import {
  type Event,
  type Task,
  type TaskId,
  TaskStatus,
  type TasksList,
  type TasksListId,
} from '@/shared/kernel'
import {
  type ICodecService,
  dateCodec,
  makeMapCodec,
  makeSetCodec,
  makeWithCodec,
} from '@/shared/storage'

import { type StorableToDoServiceState } from '@/entities/todo'

export type EncodedTasksList = Omit<TasksList, 'tasks' | 'createdAt'> & {
  tasks: Record<TaskStatus, TaskId[]>
  createdAt: string
}

export type EncodedTask = Omit<Task, 'createdAt'> & { createdAt: string }

export type EncodedEvent = Omit<Event, 'createdAt'> & { createdAt: string }

export interface EncodedStorableToDoServiceState {
  lists: Array<[TasksListId, EncodedTasksList]>
  tasks: Array<[TaskId, EncodedTask]>
  events: EncodedEvent[]
}

const taskCodec: ICodecService<Task, EncodedTask> = {
  encode(data) {
    return {
      ...data,
      createdAt: dateCodec.encode(data.createdAt),
    }
  },
  decode(data) {
    return {
      ...data,
      createdAt: dateCodec.decode(data.createdAt),
    }
  },
}
const tasksCodec = makeMapCodec<TaskId, Task, EncodedTask>(taskCodec)
const taskIdCodec = makeSetCodec<TaskId>()
const tasksListCodec: ICodecService<TasksList, EncodedTasksList> = {
  encode(data) {
    return {
      ...data,
      createdAt: dateCodec.encode(data.createdAt),
      tasks: {
        [TaskStatus.NotDone]: taskIdCodec.encode(
          data.tasks[TaskStatus.NotDone]
        ),
        [TaskStatus.Done]: taskIdCodec.encode(data.tasks[TaskStatus.Done]),
        [TaskStatus.Archived]: taskIdCodec.encode(
          data.tasks[TaskStatus.Archived]
        ),
      },
    }
  },
  decode(data) {
    return {
      ...data,
      createdAt: dateCodec.decode(data.createdAt),
      tasks: {
        [TaskStatus.NotDone]: taskIdCodec.decode(
          data.tasks[TaskStatus.NotDone]
        ),
        [TaskStatus.Done]: taskIdCodec.decode(data.tasks[TaskStatus.Done]),
        [TaskStatus.Archived]: taskIdCodec.decode(
          data.tasks[TaskStatus.Archived]
        ),
      },
    }
  },
}
const listsCodec = makeMapCodec<TasksListId, TasksList, EncodedTasksList>(
  tasksListCodec
)
const eventCodec: ICodecService<Event, EncodedEvent> = {
  encode(data) {
    return {
      ...data,
      createdAt: dateCodec.encode(data.createdAt),
    }
  },
  decode(data) {
    return {
      ...data,
      createdAt: dateCodec.decode(data.createdAt),
    } as Event
  },
}
const storableToDoServiceStateCodec: ICodecService<
  StorableToDoServiceState,
  EncodedStorableToDoServiceState
> = {
  encode({ lists, events, tasks }) {
    return {
      lists: listsCodec.encode(lists),
      tasks: tasksCodec.encode(tasks),
      events: events.map(eventCodec.encode),
    }
  },
  decode({ events, lists, tasks }) {
    return {
      lists: listsCodec.decode(lists),
      tasks: tasksCodec.decode(tasks),
      events: events.map(eventCodec.decode),
    }
  },
}

export const withStorableToDoServiceStateCodec = makeWithCodec(
  storableToDoServiceStateCodec
)
