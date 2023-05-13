import { Route } from 'atomic-router-react/scope'

import { routes } from '@/shared/router'

import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { TasksListPage } from '@/pages/tasks-list'
import { WorkspacePage } from '@/pages/workspace'

export function Routes(): JSX.Element {
  return (
    <>
      <Route route={routes.home} view={HomePage} />
      <Route route={routes.workspace.index} view={WorkspacePage} />
      <Route route={routes.workspace.tasksList} view={TasksListPage} />
      <Route route={routes.notFound} view={NotFoundPage} />
    </>
  )
}
