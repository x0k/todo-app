import { useTasksList } from '../hooks'
import { updateTasksListFx } from '../model'
import { type TasksList, type TasksListId } from '../types'

export interface TasksListContainerRenderProps {
  tasksList: TasksList
  archiveTasksList: () => void
}
export interface TasksListContainerProps {
  tasksListId: TasksListId
  children: (props: TasksListContainerRenderProps) => JSX.Element | null
}

export function TasksListContainer({
  tasksListId,
  children,
}: TasksListContainerProps): JSX.Element | null {
  const tasksList = useTasksList(tasksListId)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return tasksList
    ? children({
        tasksList,
        archiveTasksList: () => {
          updateTasksListFx({
            tasksListId: tasksList.id,
            change: { isArchived: true },
          })
        },
      })
    : null
}
