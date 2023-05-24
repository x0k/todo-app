import equal from 'fast-deep-equal/es6'
import memoizeOne, { type MemoizedFn } from 'memoize-one'

// https://github.com/vitejs/vite-plugin-react-swc/issues/86
// export function memoize(
//   _target: any,
//   _key: string,
//   descriptor: PropertyDescriptor
// ): PropertyDescriptor {
//   console.log(arguments)
//   descriptor.value = memoizeOne(descriptor.value, equal)
//   return descriptor
// }

function equalWithPromise<T>(a: T, b: T): boolean {
  if (a instanceof Promise) {
    return b instanceof Promise ? a === b : false
  }
  return equal(a, b)
}

export function memoize<F extends (this: any, ...args: any[]) => any>(
  fn: F
): MemoizedFn<F> {
  return memoizeOne(fn, equalWithPromise)
}
