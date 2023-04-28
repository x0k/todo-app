import { describe, expect, it } from 'vitest'

import { countArrayChanges } from './array'

function identity<T>(a: T): T {
  return a
}

describe('countArrayOfUniqItemsChanges', () => {
  it('Should properly count number of changes 1', () => {
    const a = [1, 2, 3]
    const b: number[] = []
    expect(countArrayChanges(a, b, identity)).toBe(3)
  })
  it('Should properly count number of changes 2', () => {
    const a = [1, 2, 3]
    const b = [1, 4, 5, 2, 3]
    expect(countArrayChanges(a, b, identity)).toBe(2)
  })
  it('Should properly count number of changes 3', () => {
    const a = [1, 2, 3]
    const b = [1, 4, 3, 5]
    expect(countArrayChanges(a, b, identity)).toBe(2)
  })
})
