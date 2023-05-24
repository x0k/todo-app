import { type IIDBService, type WorkspaceId } from '@/shared/kernel'

export class IDBService implements IIDBService {
  getDBName = (workspaceId: WorkspaceId): string => `todo-${workspaceId}`
}
