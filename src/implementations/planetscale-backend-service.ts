import { eq, inArray } from 'drizzle-orm'

import {
  type EncodedEvent,
  type EncodedWorkspaceData,
  type Event,
  type IBackendService,
  TaskStatus,
  type TasksList,
  type Workspace,
  type WorkspaceData,
  type WorkspaceId,
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'
import {
  type PSDB,
  events,
  tasks,
  tasksLists,
} from '@/shared/planetscale-schema'
import { type WorkspaceTasksListRouteParams } from '@/shared/router'

import {
  type ITasksListService,
  PlanetScaleTasksListService,
} from '@/entities/tasks-list'
import { type IToDoService, PlanetScaleToDoService } from '@/entities/todo'

export class PlanetScaleBackendService implements IBackendService {
  constructor(
    private readonly db: PSDB,
    private readonly workspaceDataCodec: ICodecService<
      WorkspaceData,
      EncodedWorkspaceData
    >,
    private readonly eventCodec: ICodecService<Event, EncodedEvent>,
    private readonly dateCodec: ICodecService<Date, string>
  ) {}

  getTasksListService = async (
    params: WorkspaceTasksListRouteParams
  ): Promise<ITasksListService> => {
    return new PlanetScaleTasksListService(this.db, params.tasksListId)
  }

  getToDoService = async (workspaceId: WorkspaceId): Promise<IToDoService> => {
    return new PlanetScaleToDoService(
      this.db,
      workspaceId,
      this.eventCodec,
      this.dateCodec
    )
  }

  export = async (workspace: Workspace): Promise<EncodedWorkspaceData> => {
    const allTasksLists = await this.db.query.tasksLists.findMany({
      where: eq(tasksLists.workspaceId, workspace.id),
    })
    const tasksListsWithTasks: TasksList[] = allTasksLists.map((tasksList) => ({
      ...tasksList,
      tasks: {
        [TaskStatus.Archived]: new Set(),
        [TaskStatus.Done]: new Set(),
        [TaskStatus.NotDone]: new Set(),
      },
      tasksCount: 0,
    }))
    const tasksListMap = new Map(
      tasksListsWithTasks.map((tasksList) => [tasksList.id, tasksList])
    )
    const allTasks = await this.db.query.tasks.findMany({
      where: inArray(tasks.tasksListId, Array.from(tasksListMap.keys())),
    })
    for (const task of allTasks) {
      const tasksList = tasksListMap.get(task.tasksListId)
      if (tasksList) {
        tasksList.tasksCount++
        tasksList.tasks[task.status].add(task.id)
      }
    }
    const allEvents = await this.db.query.events.findMany({
      where: eq(events.workspaceId, workspace.id),
    })
    const decodedEvents = allEvents.map(
      ({ workspaceId, data, ...rest }) => ({ ...rest, ...data } as Event)
    )
    const data: WorkspaceData = {
      tasks: allTasks,
      tasksLists: tasksListsWithTasks,
      events: decodedEvents,
    }
    return this.workspaceDataCodec.encode(data)
  }

  import = async (
    workspace: Workspace,
    data: EncodedWorkspaceData
  ): Promise<void> => {
    const decoded = this.workspaceDataCodec.decode(data)
    await this.db.transaction(async (tx) => {
      await tx.delete(events).where(eq(events.workspaceId, workspace.id))
      // Tasks should be removed by constraints
      await tx
        .delete(tasksLists)
        .where(eq(tasksLists.workspaceId, workspace.id))
      await tx.insert(tasksLists).values(
        decoded.tasksLists.map((tasksList) => ({
          ...tasksList,
          workspaceId: workspace.id,
        }))
      )
      await tx.insert(tasks).values(decoded.tasks)
      await tx.insert(events).values(
        decoded.events.map(({ type, id, createdAt, ...data }) => ({
          workspaceId: workspace.id,
          type,
          id,
          createdAt,
          data,
        }))
      )
    })
  }
}
