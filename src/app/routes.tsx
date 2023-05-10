// @ts-expect-error wtf
import { Route } from 'atomic-router-react/scope'

import { routes } from '@/shared/routes'

import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { WorkspacePage } from '@/pages/workspace'

export function Routes(): JSX.Element {
  return (
    <>
      <Route route={routes.home} view={HomePage} />
      <Route route={routes.workspace} view={WorkspacePage} />
      <Route route={routes.notFound} view={NotFoundPage} />
    </>
  )
}
