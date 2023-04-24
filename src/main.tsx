import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { NotificationsContainer } from './features/notifications'
import {
  InMemoryToDoService,
  TasksListComponent,
  TasksListContainer,
  TasksListsContainer,
} from './features/todo'
import './index.css'
import { initApp } from './init'

initApp(new InMemoryToDoService())

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <TasksListsContainer>
      {(listId) => (
        <TasksListContainer key={listId} tasksListId={listId}>
          {({ list, tasks }) => (
            <TasksListComponent
              title={list.title}
              tasks={tasks}
              onClick={console.log}
              onEdit={console.log}
            />
          )}
        </TasksListContainer>
      )}
    </TasksListsContainer>
    <NotificationsContainer />
  </React.StrictMode>
)
