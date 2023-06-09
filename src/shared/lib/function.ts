export function noop(): void {}

export function identity<T>(value: T): T {
  return value
}

export function eq<T>(value: T) {
  return function <V extends T>(v: V) {
    return value === v
  }
}

export function apply<T>(value: T): <R>(fn: (value: T) => R) => R {
  return <R>(fn: (value: T) => R) => fn(value)
}

export function memoize<K, R>(
  fn: (key: K) => R,
  cache: K extends Record<string, unknown> ? WeakMap<K, R> : Map<K, R>
) {
  return (key: K): R => {
    if (cache.has(key)) {
      return cache.get(key) as R
    }
    const value = fn(key)
    cache.set(key, value)
    return value
  }
}

export function args<Args extends unknown[]>(...arr: Args): Args {
  return arr
}
