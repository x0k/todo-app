// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Config {}

// @ts-expect-error Config is empty
const config: Config = {}

export function defineConfig(cfg: Config): void {
  Object.assign(config, cfg)
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Registry {}

// @ts-expect-error Registry is empty
const registry: Registry = {}

type F = (...args: unknown[]) => unknown

function wrap<T extends object>(
  obj: T,
  root: object = obj,
  path: Array<string | symbol> = []
): T {
  function materialize(key: string | symbol): unknown {
    let i = 0
    let node = root
    while (i < path.length) {
      node = node[path[i++] as keyof object]
    }
    return node[key as keyof object]
  }
  // TODO: Add cache by using WeakMap
  return new Proxy(obj, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)
      const type = typeof value
      switch (type) {
        case 'object':
          if (value === null || value === undefined) {
            return materialize(key)
          }
          return wrap(value, root, path.concat(key))
        case 'function':
          return new Proxy(value as F, {
            apply(_, thisArg, args) {
              return Reflect.apply(materialize(key) as F, thisArg, args)
            },
          })
        default:
          return materialize(key)
      }
    },
  })
}

export const r = wrap(registry)

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
  Object.defineProperty(registry, key, {
    get: factory.bind(registry, config),
  })
}
