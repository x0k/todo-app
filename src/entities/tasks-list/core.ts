import { type Task, type TaskId, type TasksList } from '@/shared/kernel'

export interface TasksListState {
  tasksList: TasksList
  tasks: Map<TaskId, Task>
}

export interface ITasksListService {
  loadTasksList: () => Promise<TasksListState>
}
