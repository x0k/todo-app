import { type Union } from './lib/type'

export interface State<T extends string> {
  type: T
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyObject {}

export interface Loadable<T, E> {
  idle: EmptyObject
  loading: EmptyObject
  loaded: { data: T }
  error: { error: E }
}

export type States<S> = Union<{
  [K in keyof S]: State<K & string> & S[K]
}>
