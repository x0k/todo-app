import { type Task, type TaskId, type TasksList, type TasksListId } from '@/shared/kernel'

export interface TasksListState {
  tasksList: TasksList
  tasks: Map<TaskId, Task>
}

export interface ITasksListService {
  loadTasksList: (id: TasksListId) => Promise<TasksListState>
}
