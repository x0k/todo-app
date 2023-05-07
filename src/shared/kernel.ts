import { type Brand } from './lib/type'

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
  TaskCreated = 'taskCreated',
  TasksCreated = 'tasksCreated',
  TasksListCreated = 'tasksListCreated',
  TaskUpdated = 'taskUpdated',
  TasksListUpdated = 'tasksListUpdated',
  TaskCompleted = 'taskCompleted',
  TasksArchived = 'tasksArchived',
}

export interface AbstractEvent<T extends EventType> {
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

export type WorkspaceId = Brand<'WorkspaceId', string>

export interface Workspace {
  id: WorkspaceId
  title: string
}

export type WritableWorkspaceData = Partial<Pick<Workspace, 'title'>>
