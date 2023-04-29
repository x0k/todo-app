import {
  CreateTasksForm,
  type CreateTasksFormData,
  createTasksFx,
  createTasksListFx,
  useTasksLists,
} from '@/entities/todo'

function handleSubmit({ tasks, tasksList }: CreateTasksFormData): void {
  if (typeof tasksList === 'string') {
    createTasksListFx({
      title: tasksList,
      tasks: tasks.map((t) => t.title),
    })
  } else {
    createTasksFx({
      tasksListId: tasksList.id,
      tasks: tasks.map((t) => t.title),
    })
  }
}

export function CreateTasksContainer(): JSX.Element {
  const tasksLists = useTasksLists()
  return <CreateTasksForm tasksLists={tasksLists} onSubmit={handleSubmit} />
}
