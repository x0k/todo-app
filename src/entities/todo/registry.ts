import { defineService, singleton } from '@/shared/registry'

import { type IToDoService } from '@/models/todo'

import { InMemoryToDoService } from './in-memory-todo-service'

declare module '@/shared/registry' {
  interface Registry {
    todoService: IToDoService
  }
}

defineService(
  'todoService',
  singleton(() => new InMemoryToDoService())
)
