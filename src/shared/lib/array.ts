export type RecordKeyType = string | number

export function map<T, R>(fn: (value: T) => R) {
  return (array: T[]) => array.map(fn)
}

export function reverseMap<T, R>(fn: (value: T) => R, items: T[]): R[] {
  const result = new Array<R>(items.length)
  for (let i = items.length - 1, x = 0; i >= 0; i--, x++) {
    result[x] = fn(items[i])
  }
  return result
}

export function makeGroupBy<T, Keys extends readonly RecordKeyType[]>(
  keys: Keys,
  classify: (value: T) => Keys[number]
): (array: T[]) => Record<Keys[number], T[]> {
  const initialValue = keys.reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
    {} as Record<Keys[number], T[]>
  )
  function reducer(
    acc: Record<Keys[number], T[]>,
    item: T
  ): Record<Keys[number], T[]> {
    const key = classify(item)
    return {
      ...acc,
      [key]: [...acc[key], item],
    }
  }
  return (array: T[]) => array.reduce(reducer, initialValue)
}

export function makeArrayComparator<T>(
  compare: (a: T, b: T) => number
): (a: T[], b: T[]) => number {
  return (a, b) => {
    if (a.length < b.length) {
      return -1
    }
    if (a.length > b.length) {
      return 1
    }
    const len = a.length
    let i = 0
    while (i < len) {
      const result = compare(a[i], b[i])
      if (result !== 0) {
        return result
      }
      i++
    }
    return 0
  }
}

export function countArrayChanges<T, K>(
  a: T[], // old
  b: T[], // new
  getUniqKey: (item: T) => K
): number {
  if (a === b) {
    return 0
  }
  const aLen = a.length
  const bLen = b.length
  if (aLen === 0 || bLen === 0) {
    return Math.abs(aLen - bLen)
  }
  let changes = 0
  let aIndex = 0
  let bIndex = 0
  const aKeys = a.map(getUniqKey)
  const bKeys = b.map(getUniqKey)
  do {
    const aKey = aKeys[aIndex]
    const bKey = bKeys[bIndex]
    if (aKey !== bKey) {
      const newAItemIndex = bKeys.indexOf(aKey, bIndex + 1)
      if (newAItemIndex > 0) {
        // new item(s) inserted
        changes += newAItemIndex - bIndex
        aIndex++
        bIndex = newAItemIndex + 1
      } else {
        // old item(s) removed
        const oldBIndex = aKeys.indexOf(bKey, aIndex + 1)
        if (oldBIndex > 0) {
          // old item(s) removed
          changes += oldBIndex - aIndex
          aIndex = oldBIndex + 1
          bIndex = bIndex++
        } else {
          // new item inserted and old item removed
          changes++
          aIndex++
          bIndex++
        }
      }
    } else {
      aIndex++
      bIndex++
    }
  } while (aIndex < aLen && bIndex < bLen)
  return changes + aLen - aIndex + bLen - bIndex
}
