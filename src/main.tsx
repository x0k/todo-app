import { RouterProvider } from 'atomic-router-react/scope'
import { allSettled, fork, sample } from 'effector'
// @ts-expect-error wtf
import { attachLogger } from 'effector-logger'
import { Provider } from 'effector-react/scope'
import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app'
import { IDBBackendPoolService } from './implementations/idb-backend-pool-service'
import { RegistryService } from './implementations/registry-service'
import { $registryService, appStarted } from './shared/app'
import { BackendType } from './shared/kernel'
import { router } from './shared/router'

export const scope = fork({
  values: [
    [
      $registryService,
      new RegistryService({
        [BackendType.IndexedDB]: new IDBBackendPoolService(),
      }),
    ],
  ],
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

attachLogger({ scope })

allSettled(appStarted, { scope })
  .then(() => {
    root.render(
      <React.StrictMode>
        <Provider value={scope}>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </Provider>
      </React.StrictMode>
    )
  })
  .catch(console.error)
