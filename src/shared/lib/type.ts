export type PickByValuesType<Record, Type> = {
  [Key in keyof Record as Record[Key] extends Type ? Key : never]: Record[Key]
}

export type Brand<T, K> = K & { __brand: T }

export type Union<T> = T[keyof T]