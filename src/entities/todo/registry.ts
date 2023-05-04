import { defineService, singleton } from '@/shared/registry'

import { TestToDoService } from './test-todo-service'
import { type IToDoService } from './core'

declare module '@/shared/registry' {
  interface Registry {
    todoService: IToDoService
  }
}

defineService(
  'todoService',
  singleton(() => new TestToDoService())
)
