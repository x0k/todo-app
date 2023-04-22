import { type Brand } from '@/lib/type'

export type TaskId = Brand<'TaskID', string>

export enum TaskStatus {
  NotDone = 'n',
  Archived = 'a',
  Done = 'd',
}

export interface Task {
  id: TaskId
  tasksListId: TasksListId
  title: string
  status: TaskStatus
  createdAt: Date
}

export type WritableTaskData = Pick<Task, 'title' | 'status'>

export interface CreateTask {
  title: string
}

export interface UpdateTask {
  taskId: TaskId
  change: WritableTaskData
}

export type TasksListId = Brand<'TasksListID', string>

export interface TasksList {
  id: TasksListId
  title: string
  isArchived: boolean
  tasks: Task[]
  createdAt: Date
}

export type WritableTasksListData = Pick<TasksList, 'title' | 'isArchived'>

export interface CreateTasksList {
  title: string
  tasks: string[]
}

export interface UpdateTasksList {
  tasksListId: TasksListId
  change: WritableTasksListData
}

export enum EventType {
  TaskCreated = 'tc',
  TasksListCreated = 'tlc',
  TaskUpdated = 'tu',
  TasksListUpdated = 'tlu',
}

export interface AbstractEvent<T extends EventType> {
  type: T
  createdAt: Date
}

export interface TaskCreatedEvent extends AbstractEvent<EventType.TaskCreated> {
  task: Task
}

export interface TasksListCreatedEvent
  extends AbstractEvent<EventType.TasksListCreated> {
  list: TasksList
}

export interface TaskUpdatedEvent extends AbstractEvent<EventType.TaskUpdated> {
  tasksListId: TasksListId
  taskId: TaskId
  change: WritableTaskData
}

export interface TasksListUpdatedEvent
  extends AbstractEvent<EventType.TasksListUpdated> {
  tasksListId: TasksListId
  change: WritableTasksListData
}

export type Event =
  | TaskCreatedEvent
  | TasksListCreatedEvent
  | TaskUpdatedEvent
  | TasksListUpdatedEvent

export interface IToDoService {
  loadTasksLists: () => Promise<TasksList[]>
  createTask: (data: CreateTask) => Promise<Task>
  createTasksList: (data: CreateTasksList) => Promise<TasksList>
  updateTask: (data: UpdateTask) => Promise<void>
  updateTasksList: (data: UpdateTasksList) => Promise<void>
}

const HANDLERS: {
  [T in EventType]: (
    state: TasksList[],
    event: Extract<Event, AbstractEvent<T>>
  ) => TasksList[]
} = {
  [EventType.TaskCreated]: (state, event) =>
    state.map((list) =>
      list.id === event.task.tasksListId
        ? { ...list, tasks: [...list.tasks, event.task] }
        : list
    ),
  [EventType.TasksListCreated]: (state, event) => state.concat(event.list),
  [EventType.TaskUpdated]: (state, event) =>
    state.map((list) =>
      list.id === event.tasksListId
        ? {
            ...list,
            tasks: list.tasks.map((task) =>
              task.id === event.taskId ? { ...task, ...event.change } : task
            ),
          }
        : list
    ),
  [EventType.TasksListUpdated]: (state, event) =>
    state.map((list) =>
      list.id === event.tasksListId ? { ...list, ...event.change } : list
    ),
}

export function reducer(state: TasksList[], event: Event): TasksList[] {
  return HANDLERS[event.type](state, event as never)
}
