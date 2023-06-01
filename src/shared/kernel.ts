import { type ITasksListService } from '@/entities/tasks-list'
import { type IToDoService } from '@/entities/todo'

import { type Brand, type EmptyObject } from './lib/type'
import { type WorkspaceTasksListRouteParams } from './router'

export type TaskId = Brand<'TaskID', string>

export enum TaskStatus {
  NotDone = 'n',
  Archived = 'a',
  Done = 'd',
}

export const TASK_STATUSES = Object.values(TaskStatus)

export interface Task {
  id: TaskId
  tasksListId: TasksListId
  title: string
  status: TaskStatus
  createdAt: Date
}

export type WritableTaskData = Partial<Pick<Task, 'title'>>

export type TasksListId = Brand<'TasksListID', string>

export type Tasks = Record<TaskStatus, Set<TaskId>>

export interface TasksList {
  id: TasksListId
  title: string
  isArchived: boolean
  tasks: Tasks
  tasksCount: number
  createdAt: Date
}

export type WritableTasksListData = Partial<
  Pick<TasksList, 'title' | 'isArchived'>
>

export enum EventType {
  TaskCreated = 't_c',
  TasksCreated = 'ts_c',
  TasksListCreated = 'tl_c',
  TaskUpdated = 't_u',
  TasksListUpdated = 'tl_u',
  TaskCompleted = 't_ct',
  TasksArchived = 'ts_a',
}

export type EventId = Brand<'EventID', string>

export interface AbstractEvent<T extends EventType> {
  id: EventId
  type: T
  createdAt: Date
}

export interface TaskCreatedEvent extends AbstractEvent<EventType.TaskCreated> {
  tasksListId: TasksListId
  task: Task
}

export interface TasksCreatedEvent
  extends AbstractEvent<EventType.TasksCreated> {
  tasksListId: TasksListId
  tasks: Task[]
}

export interface TasksListCreatedEvent
  extends AbstractEvent<EventType.TasksListCreated> {
  list: TasksList
  tasks: Task[]
}

export interface TaskUpdatedEvent extends AbstractEvent<EventType.TaskUpdated> {
  taskId: TaskId
  change: WritableTaskData
}

export interface TasksListUpdatedEvent
  extends AbstractEvent<EventType.TasksListUpdated> {
  tasksListId: TasksListId
  change: WritableTasksListData
}

export interface TaskCompletedEvent
  extends AbstractEvent<EventType.TaskCompleted> {
  taskId: TaskId
  message: string
}

export interface TasksArchivedEvent
  extends AbstractEvent<EventType.TasksArchived> {
  tasksIds: TaskId[]
}

export type Event =
  | TaskCreatedEvent
  | TasksCreatedEvent
  | TasksListCreatedEvent
  | TaskUpdatedEvent
  | TasksListUpdatedEvent
  | TaskCompletedEvent
  | TasksArchivedEvent

export enum BackendType {
  IndexedDB = 'indexedDB',
  PlanetScale = 'planetscale',
}

export const BACKEND_TYPES = Object.values(BackendType)

export const BACKEND_TITLES: Record<BackendType, string> = {
  [BackendType.IndexedDB]: 'Indexed database',
  [BackendType.PlanetScale]: 'PlanetScale',
}
export interface BackendConfigs {
  [BackendType.IndexedDB]: EmptyObject
  [BackendType.PlanetScale]: {
    url: string
  }
}

export interface BackendData<T extends BackendType> {
  type: T
  config: BackendConfigs[T]
}

export type EncodedTask = Omit<Task, 'createdAt'> & {
  createdAt: string
}

export type EncodedTaskList = Omit<TasksList, 'tasks' | 'createdAt'> & {
  createdAt: string
  tasks: Record<TaskStatus, TaskId[]>
}
// Omit will broke whole type
// TODO: Rewrite this type with encoded variants
export type EncodedEvent = (
  | Exclude<Event, TasksListCreatedEvent | TasksCreatedEvent | TaskCreatedEvent>
  | (
      | (Omit<TaskCreatedEvent, 'task'> & {
          task: EncodedTask
        })
      | (Omit<TasksCreatedEvent, 'tasks'> & {
          tasks: EncodedTask[]
        })
      | (Omit<TasksListCreatedEvent, 'list' | 'tasks'> & {
          list: EncodedTaskList
          tasks: EncodedTask[]
        })
    )
) & {
  createdAt: string
}

export interface EncodedWorkspaceData {
  tasks: EncodedTask[]
  events: EncodedEvent[]
  tasksLists: EncodedTaskList[]
}

export interface WorkspaceData {
  tasks: Task[]
  events: Event[]
  tasksLists: TasksList[]
}

export interface IBackendManagerService<T extends BackendType> {
  resolve: (workspace: Workspace<T>) => Promise<IBackendService>
  release: (workspace: Workspace<T>) => Promise<void>
}

export interface IBackendService {
  getTasksListService: (
    params: WorkspaceTasksListRouteParams
  ) => Promise<ITasksListService>
  getToDoService: (workspaceId: WorkspaceId) => Promise<IToDoService>
  export: (workspace: Workspace) => Promise<EncodedWorkspaceData>
  import: (workspace: Workspace, data: EncodedWorkspaceData) => Promise<void>
}

export type WorkspaceId = Brand<'WorkspaceId', string>

export interface Workspace<T extends BackendType = BackendType> {
  id: WorkspaceId
  title: string
  backend: BackendData<T>
}

export type WritableWorkspaceData = Partial<Pick<Workspace, 'title'>>
