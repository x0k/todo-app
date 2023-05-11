import { sample } from 'effector'

import { type Task, TaskStatus } from '@/shared/kernel'

import { $tasksState, archiveTasksFx, todo } from '../../model'

const dashboard = todo.createDomain('dashboard')

// Stores

export const $dashboard = $tasksState.map((state) => {
  const notDoneTasks: Task[] = []
  const doneTasks: Task[] = []
  for (const list of state.lists.values()) {
    const { tasks } = list
    if (
      list.isArchived ||
      list.tasksCount === 0 ||
      list.tasksCount === tasks[TaskStatus.Archived].size
    ) {
      continue
    }
    if (tasks[TaskStatus.Done].size > 0) {
      for (const taskId of tasks[TaskStatus.Done]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          doneTasks.push(task)
        }
      }
    } else {
      for (const taskId of tasks[TaskStatus.NotDone]) {
        const task = state.tasks.get(taskId)
        if (task !== undefined) {
          notDoneTasks.push(task)
          break
        }
      }
    }
  }
  return {
    doneTasks,
    notDoneTasks,
    tasksLists: state.lists,
  }
})

// Events

export const doneTasksArchiving = dashboard.createEvent()

sample({
  clock: doneTasksArchiving,
  source: $dashboard,
  fn: ({ doneTasks }) => ({
    newStatus: TaskStatus.Archived,
    tasksIds: doneTasks.map((t) => t.id),
  }),
  target: archiveTasksFx,
})
