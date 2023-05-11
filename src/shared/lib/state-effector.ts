import { type Effect, type Store } from 'effector'

import { type Loadable, type States } from './state'

// export function createLoadable<T, E = Error>(
//   initial: States<Loadable<T, E>>,
// ): Store<States<Loadable<T, E>>> {
//   return createStore(initial)
// }

export function bindLoadable<T, E>(
  store: Store<States<Loadable<T, E>>>,
  effect: Effect<any, T, E>
): Store<States<Loadable<T, E>>> {
  return store
    .on(effect, () => ({ type: 'loading' }))
    .on(effect.doneData, (_, data) => ({ type: 'loaded', data }))
    .on(effect.failData, (_, error) => ({ type: 'error', error }))
}
