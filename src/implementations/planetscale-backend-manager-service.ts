import { connect } from '@planetscale/database'
import { MySqlDialect, MySqlSession } from 'drizzle-orm/mysql-core'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

import {
  type BackendType,
  type IBackendManagerService,
  type IBackendService,
  type Workspace,
} from '@/shared/kernel'
import { schema } from '@/shared/planetscale-schema'

import migrations from './hydrated-drizzle-migrations/planetscale.json'
import { PlanetScaleBackendService } from './planetscale-backend-service'
import { workspaceDataCodec } from './workspace-data-codec'

export class PlanetScaleBackendManagerService
  implements IBackendManagerService<BackendType.PlanetScale>
{
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
    return new PlanetScaleBackendService(db, workspaceDataCodec)
  }

  release = async (
    workspace: Workspace<BackendType.PlanetScale>
  ): Promise<void> => {
    // TODO: Remove data assigned to workspace
  }
}
