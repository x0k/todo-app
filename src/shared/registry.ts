// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {}

// @ts-expect-error Config is empty
export const c: Config = {}

export function defineConfig(config: Config): void {
  Object.assign(c, config)
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Registry {}

// @ts-expect-error Registry is empty
export const r: Registry = {}

type Factory<T> = (c: Config) => T

export function singleton<T>(factory: Factory<T>): Factory<T> {
  let instance: T | undefined
  return (c) => {
    if (instance === undefined) {
      instance = factory(c)
    }
    return instance
  }
}

export function defineService<K extends keyof Registry, V extends Registry[K]>(
  key: K,
  factory: Factory<V>
): void {
  Object.defineProperty(r, key, {
    get: factory.bind(r, c),
  })
}
