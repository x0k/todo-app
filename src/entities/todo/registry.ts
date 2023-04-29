import { defineService, singleton } from '@/shared/registry'

import { InMemoryToDoService } from './in-memory-todo-service'
import { type IToDoService } from './types'

declare module '@/shared/registry' {
  interface Registry {
    todoService: IToDoService
  }
}

defineService(
  'todoService',
  singleton(() => new InMemoryToDoService())
)
