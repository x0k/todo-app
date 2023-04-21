import { type Event } from 'effector'
import { type DependencyList, useEffect } from 'react'

export function useWatch<T>(
  unit: Event<T>,
  watcher: (payload: T) => void,
  deps?: DependencyList
): void {
  useEffect(() => unit.watch(watcher), ([unit] as DependencyList).concat(deps))
}
