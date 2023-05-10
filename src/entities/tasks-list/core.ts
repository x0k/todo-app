import { type TasksList, type TasksListId } from '@/shared/kernel'

export interface ITasksListService {
  loadTasksList: (id: TasksListId) => Promise<TasksList>
}
