import { type Brand } from '@/lib/type'

export type TaskID = Brand<'TaskID', string>

export enum TaskStatus {
  NotDone = 'n',
  Archived = 'a',
  Done = 'd',
}

export interface Task {
  id: TaskID
  title: string
  status: TaskStatus
  createdAt: Date
}

export type TasksListID = Brand<'TasksListID', string>

export interface TasksList {
  id: TasksListID
  title: string
  isArchived: boolean
  tasks: Task[]
  createdAt: Date
}

// export enum EventType {
//   CreateTask = 'ct',
//   CreateTasksList = 'ctl',
//   UpdateTask = 'ut',
//   UpdateTasksList = 'utl',
//   ArchiveTask = 'at',
//   ArchiveTasksList = 'atl',
// }

// export interface AbstractEvent<T extends EventType> {
//   type: T
//   createdAt: Date
// }

// export interface CreateTaskEvent extends AbstractEvent<EventType.CreateTask> {
//   title: string
// } 