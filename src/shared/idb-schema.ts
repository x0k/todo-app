import { type DBSchema } from 'idb'

type TaskId = string
interface Task {
  id: TaskId
  tasksListId: TasksListId
  title: string
  status: TaskStatus
  createdAt: Date
}
type TasksListId = string
interface TasksList {
  id: TasksListId
  title: string
  isArchived: boolean
  tasks: Record<TaskStatus, Set<TaskId>>
  tasksCount: number
  createdAt: Date
}
type TaskStatus = 'n' | 'a' | 'd'
type EventId = string
enum EventType {
  TaskCreated = 't_c',
  TasksCreated = 'ts_c',
  TasksListCreated = 'tl_c',
  TaskUpdated = 't_u',
  TasksListUpdated = 'tl_u',
  TaskCompleted = 't_ct',
  TasksArchived = 'ts_a',
}
interface AbstractEvent<T extends EventType> {
  id: EventId
  type: T
  createdAt: Date
}

interface TaskCreatedEvent extends AbstractEvent<EventType.TaskCreated> {
  tasksListId: TasksListId
  task: Task
}

interface TasksCreatedEvent extends AbstractEvent<EventType.TasksCreated> {
  tasksListId: TasksListId
  tasks: Task[]
}

interface TasksListCreatedEvent
  extends AbstractEvent<EventType.TasksListCreated> {
  list: TasksList
  tasks: Task[]
}

type WritableTaskData = Partial<Pick<Task, 'title'>>

interface TaskUpdatedEvent extends AbstractEvent<EventType.TaskUpdated> {
  taskId: TaskId
  change: WritableTaskData
}

type WritableTasksListData = Partial<Pick<TasksList, 'title' | 'isArchived'>>

interface TasksListUpdatedEvent
  extends AbstractEvent<EventType.TasksListUpdated> {
  tasksListId: TasksListId
  change: WritableTasksListData
}

interface TaskCompletedEvent extends AbstractEvent<EventType.TaskCompleted> {
  taskId: TaskId
  message: string
}

interface TasksArchivedEvent extends AbstractEvent<EventType.TasksArchived> {
  tasksIds: TaskId[]
}

type Event =
  | TaskCreatedEvent
  | TasksCreatedEvent
  | TasksListCreatedEvent
  | TaskUpdatedEvent
  | TasksListUpdatedEvent
  | TaskCompletedEvent
  | TasksArchivedEvent

export interface IDBSchemaV1 extends DBSchema {
  task: {
    key: TaskId
    value: Task
  }
  tasksList: {
    key: TasksListId
    value: TasksList
  }
  event: {
    key: EventId
    value: Event
  }
}
