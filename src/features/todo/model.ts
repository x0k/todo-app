import { type Brand } from '@/lib/type'

export type TaskId = Brand<'TaskID', string>

export enum TaskStatus {
  NotDone = 'n',
  Archived = 'a',
  Done = 'd',
}

export const TASK_STATUSES = Object.values(TaskStatus)

export interface Task {
  id: TaskId
  title: string
  status: TaskStatus
  createdAt: Date
}

export type WritableTaskData = Pick<Task, 'title'>

export interface CreateTask {
  tasksListId: TasksListId
  title: string
}

export interface CreateTasks {
  tasksListId: TasksListId
  tasks: string[]
}

export interface UpdateTask {
  taskId: TaskId
  change: WritableTaskData
}

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
  TasksCreated = 'tc2',
  TasksListCreated = 'tlc',
  TaskUpdated = 'tu',
  TasksListUpdated = 'tlu',
  TaskStatusChanged = 'tsc',
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

export interface TaskStatusChangedEvent
  extends AbstractEvent<EventType.TaskStatusChanged> {
  tasksListId: TasksListId
  taskId: TaskId
  newStatus: TaskStatus
}

export type Event =
  | TaskCreatedEvent
  | TasksCreatedEvent
  | TasksListCreatedEvent
  | TaskUpdatedEvent
  | TasksListUpdatedEvent
  | TaskStatusChangedEvent

export interface TasksState {
  lists: Map<TasksListId, TasksList>
  tasks: Map<TaskId, Task>
}

export interface IToDoService {
  loadTasksState: () => Promise<TasksState>
  createTask: (data: CreateTask) => Promise<TaskCreatedEvent>
  createTasks: (data: CreateTasks) => Promise<TasksCreatedEvent>
  createTasksList: (data: CreateTasksList) => Promise<TasksListCreatedEvent>
  updateTask: (data: UpdateTask) => Promise<TaskUpdatedEvent>
  updateTasksList: (data: UpdateTasksList) => Promise<TasksListUpdatedEvent>
}

const HANDLERS: {
  [T in EventType]: (
    state: TasksState,
    event: Extract<Event, AbstractEvent<T>>
  ) => TasksState
} = {
  [EventType.TaskCreated]: (state, event) => {
    const tasksList = state.lists.get(event.tasksListId)
    if (tasksList === undefined) {
      return state
    }
    return {
      tasks: new Map(state.tasks).set(event.task.id, event.task),
      lists: new Map(state.lists).set(event.tasksListId, {
        ...tasksList,
        tasksCount: tasksList.tasksCount + 1,
        tasks: {
          ...tasksList.tasks,
          [event.task.status]: new Set(tasksList.tasks[event.task.status]).add(
            event.task.id
          ),
        },
      }),
    }
  },
  [EventType.TasksCreated]: (state, event) => {
    if (event.tasks.some((t) => t.status !== TaskStatus.NotDone)) {
      throw new Error('Created tasks must be not done')
    }
    const tasksList = state.lists.get(event.tasksListId)
    if (tasksList === undefined) {
      return state
    }
    const tasks = new Map(state.tasks)
    const notDoneTasks = new Set(tasksList.tasks[TaskStatus.NotDone])
    for (const task of event.tasks) {
      tasks.set(task.id, task)
      notDoneTasks.add(task.id)
    }
    return {
      tasks,
      lists: new Map(state.lists).set(event.tasksListId, {
        ...tasksList,
        tasksCount: tasksList.tasksCount + event.tasks.length,
        tasks: {
          ...tasksList.tasks,
          [TaskStatus.NotDone]: notDoneTasks,
        },
      }),
    }
  },
  [EventType.TasksListCreated]: (state, event) => {
    const tasks = new Map(state.tasks)
    for (const task of event.tasks) {
      tasks.set(task.id, task)
    }
    return {
      lists: new Map(state.lists).set(event.list.id, event.list),
      tasks: event.tasks.length > 0 ? tasks : state.tasks,
    }
  },
  [EventType.TaskUpdated]: (state, event) => {
    const task = state.tasks.get(event.taskId)
    if (task === undefined) {
      return state
    }
    return {
      ...state,
      tasks: new Map(state.tasks).set(event.taskId, {
        ...task,
        ...event.change,
      }),
    }
  },
  [EventType.TasksListUpdated]: (state, event) => {
    const list = state.lists.get(event.tasksListId)
    if (list === undefined) {
      return state
    }
    return {
      ...state,
      lists: new Map(state.lists).set(event.tasksListId, {
        ...list,
        ...event.change,
      }),
    }
  },
  [EventType.TaskStatusChanged]: (state, event) => {
    const tasksList = state.lists.get(event.tasksListId)
    if (tasksList === undefined) {
      return state
    }
    const task = state.tasks.get(event.taskId)
    if (task === undefined) {
      return state
    }
    const oldStatusTasks = new Set(tasksList.tasks[task.status])
    oldStatusTasks.delete(event.taskId)
    return {
      lists: new Map(state.lists).set(tasksList.id, {
        ...tasksList,
        tasks: {
          ...tasksList.tasks,
          [task.status]: oldStatusTasks,
          [event.newStatus]: new Set(tasksList.tasks[event.newStatus]).add(
            event.taskId
          ),
        },
      }),

      tasks: new Map(state.tasks).set(task.id, {
        ...task,
        status: event.newStatus,
      }),
    }
  },
}

export function reducer(state: TasksState, event: Event): TasksState {
  return HANDLERS[event.type](state, event as never)
}
