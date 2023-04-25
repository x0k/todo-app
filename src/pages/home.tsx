import {
  TaskStatus,
  TasksComponent,
  TasksContainer,
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
                  <TasksContainer tasksIds={list.tasks[TaskStatus.NotDone]}>
                    {(tasks) => (
                      <TasksComponent
                        tasks={tasks}
                        onClick={console.log}
                        onEdit={console.log}
                      />
                    )}
                  </TasksContainer>
                </TasksListComponent>
              )}
            </TasksListContainer>
          ))}
        </>
      )}
    </TasksListsContainer>
  )
}
