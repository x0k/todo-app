import {
  type ChangeEvent,
  type DependencyList,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>

export type ReactState<T> = [T, SetState<T>]

export function useRerender(): () => void {
  const [, setState] = useState(0)
  return useCallback(() => {
    setState(Date.now())
  }, [setState])
}

const UNDEFINED_OLD_VALUE = Symbol('Undefined old value')

type UndefinedOldValue = typeof UNDEFINED_OLD_VALUE

export function useMemoWithComparator<T>(
  factory: () => T,
  isEqual: (oldValue: T, newValue: T) => boolean,
  deps: DependencyList
): T {
  const lastValueRef = useRef<T | UndefinedOldValue>(UNDEFINED_OLD_VALUE)
  return useMemo(() => {
    const newValue = factory()
    if (
      lastValueRef.current === UNDEFINED_OLD_VALUE ||
      !isEqual(lastValueRef.current, newValue)
    ) {
      lastValueRef.current = newValue
      return newValue
    }
    return lastValueRef.current
  }, deps)
}

export function useFieldChangeHandler<T>(
  onChange: SetState<T>,
  field: keyof T
): (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
  return useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange((data) => ({ ...data, [field]: e.target.value }))
    },
    [field, onChange]
  )
}

export function memoizeInRef<T>(
  value: T,
  ref: MutableRefObject<T>,
  isEqual: (a: T, b: T) => boolean = Object.is
): T {
  if (value === ref.current || isEqual(value, ref.current)) {
    return ref.current
  }
  ref.current = value
  return value
}
