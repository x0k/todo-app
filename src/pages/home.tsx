import { map, take } from '@/lib/iterable'

import {
  TaskContainer,
  type TaskId,
  TaskItem,
  TaskStatus,
  TasksListComponent,
  TasksListContainer,
  TasksListsContainer,
} from '@/features/todo'

export function HomePage(): JSX.Element {
  return (
    <TasksListsContainer>
      {(listsIds) => (
        <>
          {listsIds.map((listId) => (
            <TasksListContainer key={listId} tasksListId={listId}>
              {(list) => {
                const tasks = list.tasks[TaskStatus.NotDone]
                return (
                  <TasksListComponent tasksList={list}>
                    {take(
                      tasks.size,
                      map(
                        (taskId: TaskId) => (
                          <TaskContainer key={taskId} taskId={taskId}>
                            {(task) => (
                              <TaskItem
                                task={task}
                                onClick={console.log}
                                onEdit={console.log}
                              />
                            )}
                          </TaskContainer>
                        ),
                        tasks
                      )
                    )}
                  </TasksListComponent>
                )
              }}
            </TasksListContainer>
          ))}
        </>
      )}
    </TasksListsContainer>
  )
}
