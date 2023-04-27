import { CreateTasksForm, type CreateTasksFormData } from '../components'

import { createTasksFx, createTasksListFx } from '../domain'

import { useTasksLists } from '../hooks'

function handleSubmit({ tasks, tasksList }: CreateTasksFormData): void {
  console.log('SUBMIT')
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
