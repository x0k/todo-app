import { makeArrayComparator } from '@/lib/array'

export const strictArrayComparator = makeArrayComparator((a, b) =>
  a === b ? 0 : 1
) as <T>(a: T, b: T) => number

export const isArrayNotEqual = <T>(a: T[], b: T[]): boolean =>
  strictArrayComparator(a, b) !== 0
