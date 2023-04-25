import { makeMap } from '@/lib/iterable'

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
              {(list) => (
                <TasksListComponent tasksList={list}>
                  {Array.from(
                    makeMap((taskId: TaskId) => (
                      <TaskContainer key={taskId} taskId={taskId}>
                        {(task) => (
                          <TaskItem
                            task={task}
                            onClick={console.log}
                            onEdit={console.log}
                          />
                        )}
                      </TaskContainer>
                    ))(list.tasks[TaskStatus.NotDone])
                  )}
                </TasksListComponent>
              )}
            </TasksListContainer>
          ))}
        </>
      )}
    </TasksListsContainer>
  )
}
