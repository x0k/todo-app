import { createHistoryRouter } from 'atomic-router'
import { createBrowserHistory } from 'history'

import { notFoundRoute, routesMap } from '@/shared/routes'

export const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute,
})

router.setHistory(createBrowserHistory())
