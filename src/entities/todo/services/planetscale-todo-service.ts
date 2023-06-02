import { eq, inArray, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import {
  type EncodedEvent,
  type Event,
  type EventId,
  EventType,
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
  type WorkspaceId,
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'
import {
  type PSDB,
  type PSTasksList,
  type PSTransaction,
  events,
  tasks as psTasks,
  tasksLists as psTasksLists,
} from '@/shared/planetscale-schema'

import {
  type ArchiveTasks,
  type CompleteTask,
  type CreateTask,
  type CreateTasks,
  type CreateTasksList,
  EVENTS_PER_PAGE,
  type IToDoService,
  type QueryEvents,
  type TasksState,
  type UpdateTask,
  type UpdateTasksList,
} from '../core'

export class PlanetScaleToDoService implements IToDoService {
  private toTasksList({ workspaceId, ...rest }: PSTasksList): TasksList {
    return {
      ...rest,
      tasks: {
        [TaskStatus.Archived]: new Set(),
        [TaskStatus.Done]: new Set(),
        [TaskStatus.NotDone]: new Set(),
      },
      tasksCount: 0,
    }
  }

  private entity<T extends string>(): { id: T; createdAt: Date } {
    return { id: nanoid() as T, createdAt: new Date() }
  }

  private tx<A, E extends Event>(
    action: (tx: PSTransaction, arg: A) => Promise<Omit<E, 'createdAt' | 'id'>>
  ): (arg: A) => Promise<E> {
    return async (arg: A) =>
      await this.db.transaction(async (tx) => {
        const eventData = await action(tx, arg)
        const event = {
          ...eventData,
          ...this.entity<EventId>(),
        } as E
        const { id, createdAt, type, ...data } = this.eventCodec.encode(event)
        await tx.insert(events).values({
          id,
          type,
          workspaceId: this.workspaceId,
          createdAt: event.createdAt,
          data,
        })
        return event
      })
  }

  constructor(
    private readonly db: PSDB,
    private readonly workspaceId: WorkspaceId,
    private readonly eventCodec: ICodecService<Event, EncodedEvent>,
    private readonly dateCodec: ICodecService<Date, string>
  ) {}

  loadTasksState = async (): Promise<TasksState> => {
    const allTasksLists = await this.db.query.tasksLists.findMany({
      where: eq(psTasksLists.workspaceId, this.workspaceId),
    })
    const lists = new Map(
      allTasksLists.map((tasksList) => [
        tasksList.id,
        this.toTasksList(tasksList),
      ])
    )
    const allTasks = await this.db.query.tasks.findMany({
      where: inArray(psTasks.tasksListId, Array.from(lists.keys())),
    })
    const tasksMap = new Map(allTasks.map((task) => [task.id, task]))
    for (const task of allTasks) {
      const tasksList = lists.get(task.tasksListId)
      if (tasksList) {
        tasksList.tasksCount++
        tasksList.tasks[task.status].add(task.id)
      }
    }
    return {
      tasks: tasksMap,
      lists,
    }
  }

  createTask = this.tx<CreateTask, TaskCreatedEvent>(
    async (tx, { tasksListId, title }) => {
      const { id, createdAt } = this.entity<TaskId>()
      await tx.insert(psTasks).values({
        id,
        title,
        tasksListId,
      })
      return {
        type: EventType.TaskCreated,
        tasksListId,
        task: {
          id,
          title,
          createdAt,
          status: TaskStatus.NotDone,
          tasksListId,
        },
      }
    }
  )

  createTasks = this.tx<CreateTasks, TasksCreatedEvent>(
    async (tx, { tasksListId, tasks: titles }) => {
      const tasks = titles.map((title) => ({
        ...this.entity<TaskId>(),
        title,
        tasksListId,
        status: TaskStatus.NotDone,
      }))
      await tx.insert(psTasks).values(tasks)
      return {
        type: EventType.TasksCreated,
        tasksListId,
        tasks,
      }
    }
  )

  createTasksList = this.tx<CreateTasksList, TasksListCreatedEvent>(
    async (tx, { title, tasks: titles }) => {
      const listData: PSTasksList = {
        ...this.entity<TasksListId>(),
        title,
        workspaceId: this.workspaceId,
        isArchived: false,
      }
      await tx.insert(psTasksLists).values(listData)
      const tasks = titles.map((title) => ({
        ...this.entity<TaskId>(),
        title,
        tasksListId: listData.id,
        status: TaskStatus.NotDone,
      }))
      await tx.insert(psTasks).values(tasks)
      const list = this.toTasksList(listData)
      for (const task of tasks) {
        list.tasks[task.status].add(task.id)
        list.tasksCount++
      }
      return {
        type: EventType.TasksListCreated,
        list,
        tasks,
      }
    }
  )

  updateTask = this.tx<UpdateTask, TaskUpdatedEvent>(
    async (tx, { taskId, change }) => {
      await tx.update(psTasks).set(change).where(eq(psTasks.id, taskId))
      return {
        type: EventType.TaskUpdated,
        taskId,
        change,
      }
    }
  )

  updateTasksList = this.tx<UpdateTasksList, TasksListUpdatedEvent>(
    async (tx, { tasksListId, change }) => {
      await tx
        .update(psTasksLists)
        .set(change)
        .where(eq(psTasksLists.id, tasksListId))
      return {
        type: EventType.TasksListUpdated,
        tasksListId,
        change,
      }
    }
  )

  completeTask = this.tx<CompleteTask, TaskCompletedEvent>(
    async (tx, { taskId, message }) => {
      await tx
        .update(psTasks)
        .set({ status: TaskStatus.Done })
        .where(eq(psTasks.id, taskId))
      return {
        type: EventType.TaskCompleted,
        message,
        taskId,
      }
    }
  )

  archiveTasks = this.tx<ArchiveTasks, TasksArchivedEvent>(
    async (tx, { tasksIds }) => {
      await tx
        .update(psTasks)
        .set({ status: TaskStatus.Archived })
        .where(inArray(psTasks.id, tasksIds))
      return {
        type: EventType.TasksArchived,
        tasksIds,
      }
    }
  )

  getEventsCount = async (): Promise<number> => {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(eq(events.workspaceId, this.workspaceId))
    return count
  }

  loadEvents = async ({ page }: QueryEvents): Promise<Event[]> => {
    const encodedEvents = await this.db
      .select()
      .from(events)
      .where(eq(events.workspaceId, this.workspaceId))
      .orderBy(events.createdAt)
      .offset((page - 1) * EVENTS_PER_PAGE)
      .limit(EVENTS_PER_PAGE)
    return encodedEvents.map(({ data, createdAt, id, type }) =>
      this.eventCodec.decode({
        ...data,
        id,
        type,
        createdAt: this.dateCodec.encode(createdAt),
      } as EncodedEvent)
    )
  }
}
