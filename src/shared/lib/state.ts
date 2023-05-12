import { type EmptyObject, type Union } from './type'

export interface State<T extends string> {
  type: T
}

export interface Loadable<T, E> {
  idle: EmptyObject
  loading: EmptyObject
  loaded: { data: T }
  error: { error: E }
}

export interface Optional<T> {
  none: EmptyObject
  just: { value: T }
}

export type States<S> = Union<{
  [K in keyof S]: State<K & string> & S[K]
}>

type WithOtherwise<S, PartialConfig, R> = PartialConfig & {
  otherwise: (state: Union<Omit<S, keyof PartialConfig>>) => R
}

export type FoldConfig<S, R> =
  | WithOtherwise<
      S,
      {
        [K in keyof S]?: (state: S[K]) => R
      },
      R
    >
  | {
      [K in keyof S]: (state: S[K]) => R
    }

export function fold<S, R>(value: States<S>, config: FoldConfig<S, R>): R {
  const handler: ((state: States<S>) => R) | undefined =
    // @ts-expect-error too complex types
    config[value.type] ?? config.otherwise
  if (handler === undefined) {
    throw new Error(`Fold config or unknown state`)
  }
  return handler(value)
}

export function mapLoadable<T, R>(
  mapper: (data: T) => R
): <E>(state: States<Loadable<T, E>>) => States<Loadable<R, E>> {
  return (state) =>
    state.type === 'loaded'
      ? { type: 'loaded', data: mapper(state.data) }
      : state
}
