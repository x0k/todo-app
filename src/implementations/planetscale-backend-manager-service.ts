import { connect } from '@planetscale/database'
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
} from '@/shared/kernel'
import { type ICodecService } from '@/shared/lib/storage'
import { schema } from '@/shared/planetscale-schema'

import migrations from './hydrated-drizzle-migrations/planetscale.json'
import { PlanetScaleBackendService } from './planetscale-backend-service'

export class PlanetScaleBackendManagerService
  implements IBackendManagerService<BackendType.PlanetScale>
{
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
    return new PlanetScaleBackendService(
      db,
      this.workspaceDataCodec,
      this.eventCodec,
      this.dateCodec
    )
  }

  release = async (
    workspace: Workspace<BackendType.PlanetScale>
  ): Promise<void> => {
    // TODO: Remove data assigned to workspace
  }
}
