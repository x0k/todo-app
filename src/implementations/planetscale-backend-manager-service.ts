import { connect } from '@planetscale/database'
import { eq } from 'drizzle-orm'
import { MySqlDialect, MySqlSession } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

import {
  type BackendType,
  type EncodedEvent,
  type EncodedWorkspaceData,
  type Event,
  type IBackendManagerService,
  type IBackendService,
  type Workspace,
  type WorkspaceData,
  type WorkspaceId,
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'
import { type PSDB, events, schema, tasksLists } from '@/shared/planetscale-schema'

import migrations from './hydrated-drizzle-migrations/planetscale.json'
import { PlanetScaleBackendService } from './planetscale-backend-service'

export class PlanetScaleBackendManagerService
  implements IBackendManagerService<BackendType.PlanetScale>
{
  private async connect(workspace: Workspace): Promise<PSDB> {
    const connection = connect(workspace.backend.config)
    const db = drizzle(connection, { schema })
    if (
      'dialect' in db &&
      db.dialect instanceof MySqlDialect &&
      'session' in db &&
      db.session instanceof MySqlSession
    ) {
      await db.dialect.migrate(migrations, db.session, {
        migrationsFolder: '',
      })
    } else {
      throw new Error(
        'Drizzle PlanetScale driver implementation has been changed, update code above'
      )
    }
    return db
  }

  private connection: {
    workspaceId: WorkspaceId
    db: PSDB
    backend: PlanetScaleBackendService
  } | null = null

  constructor(
    private readonly workspaceDataCodec: ICodecService<
      WorkspaceData,
      EncodedWorkspaceData
    >,
    private readonly eventCodec: ICodecService<Event, EncodedEvent>,
    private readonly dateCodec: ICodecService<Date, string>
  ) {}

  resolve = async (
    workspace: Workspace<BackendType.PlanetScale>
  ): Promise<IBackendService> => {
    if (this.connection) {
      if (this.connection.workspaceId === workspace.id) {
        return this.connection.backend
      }
    }
    const db = await this.connect(workspace)
    const backend = new PlanetScaleBackendService(
      db,
      this.workspaceDataCodec,
      this.eventCodec,
      this.dateCodec
    )
    this.connection = {
      workspaceId: workspace.id,
      db,
      backend,
    }
    return backend
  }

  release = async (
    workspace: Workspace<BackendType.PlanetScale>
  ): Promise<void> => {
    const db =
      this.connection?.workspaceId === workspace.id
        ? this.connection.db
        : await this.connect(workspace)
    await db.transaction(async (tx) => {
      await tx
        .delete(tasksLists)
        .where(eq(tasksLists.workspaceId, workspace.id))
      await tx.delete(events).where(eq(events.workspaceId, workspace.id))
    })
  }
}
