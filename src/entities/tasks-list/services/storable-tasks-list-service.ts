import { type IAsyncStorageService } from '@/shared/storage'

import { type ITasksListService, type TasksListState } from '../core'

export class StorableTasksListService implements ITasksListService {
  constructor(
    private readonly storageService: IAsyncStorageService<TasksListState>
  ) {}

  loadTasksList = async (): Promise<TasksListState> =>
    await this.storageService.load()
}
