import {
  type AbstractEvent,
  type Event,
  EventType,
  type Task,
  type TaskCompletedEvent,
  type TaskCreatedEvent,
  type TaskId,
  TaskStatus,
  type TaskUpdatedEvent,
  type TasksArchivedEvent,
  type TasksCreatedEvent,
  type TasksList,
  type TasksListCreatedEvent,
  type TasksListId,
  type TasksListUpdatedEvent,
  type WritableTaskData,
  type WritableTasksListData,
} from '@/shared/kernel'

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

export interface CompleteTask {
  taskId: TaskId
  message: string
}

export interface ArchiveTasks {
  tasksIds: TaskId[]
}

export interface CreateTasksList {
  title: string
  tasks: string[]
}

export interface UpdateTasksList {
  tasksListId: TasksListId
  change: WritableTasksListData
}

export interface TasksState {
  lists: Map<TasksListId, TasksList>
  tasks: Map<TaskId, Task>
}

export interface QueryEvents {
  page: number
}

export interface IToDoService {
  loadTasksState: () => Promise<TasksState>
  createTask: (data: CreateTask) => Promise<TaskCreatedEvent>
  createTasks: (data: CreateTasks) => Promise<TasksCreatedEvent>
  createTasksList: (data: CreateTasksList) => Promise<TasksListCreatedEvent>
  updateTask: (data: UpdateTask) => Promise<TaskUpdatedEvent>
  updateTasksList: (data: UpdateTasksList) => Promise<TasksListUpdatedEvent>
  completeTask: (data: CompleteTask) => Promise<TaskCompletedEvent>
  archiveTasks: (data: ArchiveTasks) => Promise<TasksArchivedEvent>
  getEventsCount: () => Promise<number>
  loadEvents: (query: QueryEvents) => Promise<Event[]>
}

export const EVENTS_PER_PAGE = 100

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
      lists: state.lists,
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
      tasks: state.tasks,
      lists: new Map(state.lists).set(event.tasksListId, {
        ...list,
        ...event.change,
      }),
    }
  },
  [EventType.TaskCompleted]: (state, event) => {
    const task = state.tasks.get(event.taskId)
    if (task === undefined) {
      return state
    }
    const tasksList = state.lists.get(task.tasksListId)
    if (tasksList === undefined) {
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
          [TaskStatus.Done]: new Set(tasksList.tasks[TaskStatus.Done]).add(
            event.taskId
          ),
        },
      }),
      tasks: new Map(state.tasks).set(task.id, {
        ...task,
        status: TaskStatus.Done,
      }),
    }
  },
  [EventType.TasksArchived]: (state, event) => {
    const lists = new Map(state.lists)
    const tasks = new Map(state.tasks)
    for (const taskId of event.tasksIds) {
      const task = state.tasks.get(taskId)
      if (task === undefined) {
        continue
      }
      const tasksList = state.lists.get(task.tasksListId)
      if (tasksList === undefined) {
        continue
      }
      tasks.set(taskId, {
        ...task,
        status: TaskStatus.Archived,
      })
      const oldStatusTasks = new Set(tasksList.tasks[task.status])
      oldStatusTasks.delete(taskId)
      lists.set(tasksList.id, {
        ...tasksList,
        tasks: {
          ...tasksList.tasks,
          [task.status]: oldStatusTasks,
          [TaskStatus.Archived]: new Set(
            tasksList.tasks[TaskStatus.Archived]
          ).add(taskId),
        },
      })
    }
    return {
      lists,
      tasks,
    }
  },
}

export function reducer(state: TasksState, event: Event): TasksState {
  return HANDLERS[event.type](state, event as never)
}
