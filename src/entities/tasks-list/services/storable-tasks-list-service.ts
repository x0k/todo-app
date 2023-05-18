import { IAsyncStorageService } from '@/shared/storage'

import { ITasksListService, TasksListState } from '../core'

export class StorableTasksListService implements ITasksListService {
  constructor(
    private readonly storageService: IAsyncStorageService<TasksListState>
  ) {}

  loadTasksList = (): Promise<TasksListState> => this.storageService.load()
}
