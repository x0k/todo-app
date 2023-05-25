import {
  type EncodedEvent,
  type EncodedTask,
  type EncodedTaskList,
  type EncodedWorkspaceData,
  type Event,
  EventType,
  type Task,
  type TaskId,
  TaskStatus,
  type TasksList,
  type WorkspaceData,
} from '@/shared/kernel'
import {
  type ICodecService,
  dateCodec,
  makeArrayCodec,
  makeSetCodec,
} from '@/shared/lib/storage'

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
const tasksCodec = makeArrayCodec(taskCodec)
const setOfTaskIdCodec = makeSetCodec<TaskId>()
const tasksListCodec: ICodecService<TasksList, EncodedTaskList> = {
  encode(data) {
    return {
      ...data,
      createdAt: dateCodec.encode(data.createdAt),
      tasks: {
        [TaskStatus.NotDone]: setOfTaskIdCodec.encode(
          data.tasks[TaskStatus.NotDone]
        ),
        [TaskStatus.Done]: setOfTaskIdCodec.encode(data.tasks[TaskStatus.Done]),
        [TaskStatus.Archived]: setOfTaskIdCodec.encode(
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
        [TaskStatus.NotDone]: setOfTaskIdCodec.decode(
          data.tasks[TaskStatus.NotDone]
        ),
        [TaskStatus.Done]: setOfTaskIdCodec.decode(data.tasks[TaskStatus.Done]),
        [TaskStatus.Archived]: setOfTaskIdCodec.decode(
          data.tasks[TaskStatus.Archived]
        ),
      },
    }
  },
}
const tasksListsCodec = makeArrayCodec(tasksListCodec)
const eventCodec: ICodecService<Event, EncodedEvent> = {
  encode(data) {
    const createdAt = dateCodec.encode(data.createdAt) as Date & string
    switch (data.type) {
      case EventType.TaskCreated:
        return {
          ...data,
          createdAt,
          task: taskCodec.encode(data.task),
        }
      case EventType.TasksCreated:
        return {
          ...data,
          createdAt,
          tasks: tasksCodec.encode(data.tasks),
        }
      case EventType.TasksListCreated:
        return {
          ...data,
          createdAt,
          list: tasksListCodec.encode(data.list),
          tasks: tasksCodec.encode(data.tasks),
        }
      default:
        return {
          ...data,
          createdAt,
        }
    }
  },
  decode(data) {
    const createdAt = dateCodec.decode(data.createdAt)
    switch (data.type) {
      case EventType.TaskCreated:
        return { ...data, createdAt, task: taskCodec.decode(data.task) }
      case EventType.TasksCreated:
        return { ...data, createdAt, tasks: tasksCodec.decode(data.tasks) }
      case EventType.TasksListCreated:
        return {
          ...data,
          createdAt,
          list: tasksListCodec.decode(data.list),
          tasks: tasksCodec.decode(data.tasks),
        }
      default:
        return { ...data, createdAt }
    }
  },
}
const eventsCodec = makeArrayCodec(eventCodec)
export const workspaceDataCodec: ICodecService<
  WorkspaceData,
  EncodedWorkspaceData
> = {
  encode: (data) => {
    return {
      tasks: tasksCodec.encode(data.tasks),
      tasksLists: tasksListsCodec.encode(data.tasksLists),
      events: eventsCodec.encode(data.events),
    }
  },
  decode: (data) => {
    return {
      tasks: tasksCodec.decode(data.tasks),
      tasksLists: tasksListsCodec.decode(data.tasksLists),
      events: eventsCodec.decode(data.events),
    }
  },
}
