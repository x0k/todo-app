export function makeFilter<T, R extends T = T>(
  predicate: (value: T) => value is R
): (items: Iterable<T>) => Generator<R, void, unknown> {
  return function* (items) {
    for (const item of items) {
      if (predicate(item)) {
        yield item
      }
    }
  }
}

export function makeMap<T, R>(
  mapper: (value: T) => R
): (items: Iterable<T>) => Generator<R, void, unknown> {
  return function* (items) {
    for (const item of items) {
      yield mapper(item)
    }
  }
}

export function* concat<T>(
  ...iterables: Array<Iterable<T>>
): Generator<T, void, unknown> {
  for (const iterable of iterables) {
    for (const item of iterable) {
      yield item
    }
  }
}

// https://stackoverflow.com/questions/9960908/permutations-in-javascript
export function* permuteInPlace<T>(
  input: Iterable<T>
): Generator<T[], void, unknown> {
  const items = Array.from(input)
  yield items
  const length = items.length
  const c: number[] = new Array(length).fill(0)
  let i = 1
  let k: number
  let p: T

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i]
      p = items[i]
      items[i] = items[k]
      items[k] = p
      ++c[i]
      i = 1
      yield items
    } else {
      c[i] = 0
      ++i
    }
  }
}
