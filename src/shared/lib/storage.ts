export interface ICodecService<I, O> {
  decode: (data: O) => I
  encode: (data: I) => O
}

export type DateCodec = ICodecService<Date, string>

export const dateCodec: DateCodec = {
  encode: (data) => data.toISOString(),
  decode: (data) => new Date(data),
}

export type ArrayCodec<I, O> = ICodecService<I[], O[]>

export function makeArrayCodec<I, O>(
  valueCodec: ICodecService<I, O>
): ArrayCodec<I, O> {
  return {
    encode: (data) => data.map(valueCodec.encode),
    decode: (data) => data.map(valueCodec.decode),
  }
}

export type MapCodec<K, I, O = I> = ICodecService<Map<K, I>, Array<[K, O]>>

export function makeMapCodec<K, I>(): ICodecService<Map<K, I>, Array<[K, I]>>
export function makeMapCodec<K, I, O>(
  valueCodec: ICodecService<I, O>
): ICodecService<Map<K, I>, Array<[K, O]>>
export function makeMapCodec<K, I, O = I>(
  valueCodec?: ICodecService<I, O>
): ICodecService<Map<K, I>, Array<[K, O]>> {
  return valueCodec !== undefined
    ? {
        encode: (data): Array<[K, O]> => {
          const entries = Array.from(data)
          return entries.map((e) => [e[0], valueCodec.encode(e[1])])
        },
        decode: (data) =>
          new Map(data.map((e) => [e[0], valueCodec.decode(e[1])])),
      }
    : {
        encode: (data) => Array.from(data) as unknown as Array<[K, O]>,
        decode: (data) => new Map(data as unknown as Array<[K, I]>),
      }
}

export type SetCodec<I, O = I> = ICodecService<Set<I>, O[]>
export function makeSetCodec<I>(): ICodecService<Set<I>, I[]>
export function makeSetCodec<I, O>(
  valueCodec: ICodecService<I, O>
): ICodecService<Set<I>, O[]>
export function makeSetCodec<I, O = I>(
  valueCodec?: ICodecService<I, O>
): SetCodec<I, O> {
  return valueCodec !== undefined
    ? {
        encode: (data) => Array.from(data).map(valueCodec.encode),
        decode: (data) => new Set(data.map(valueCodec.decode)),
      }
    : {
        encode: (data) => Array.from(data) as unknown as O[],
        decode: (data) => new Set(data) as unknown as Set<I>,
      }
}

export interface IStorageService<T> {
  load: () => T
  save: (data: T) => void
  clear: () => void
}

const UNCACHED_VALUE = Symbol('Uncached value')

export function withCache<T>(
  storageService: IStorageService<T>
): IStorageService<T> {
  let cache: T | typeof UNCACHED_VALUE = UNCACHED_VALUE
  return {
    load() {
      if (cache === UNCACHED_VALUE) {
        cache = storageService.load()
      }
      return cache
    },
    save(data) {
      storageService.save(data)
      cache = data
    },
    clear() {
      cache = UNCACHED_VALUE
      storageService.clear()
    },
  }
}

export function makeWithCodec<I, O>(
  codec: ICodecService<I, O>
): (storageService: IStorageService<O>) => IStorageService<I> {
  return (storageService) => ({
    load: () => codec.decode(storageService.load()),
    save: (data) => {
      storageService.save(codec.encode(data))
    },
    clear: storageService.clear.bind(storageService),
  })
}

export const withMapCodec = makeWithCodec(makeMapCodec()) as <K, T>(
  storageService: IStorageService<Array<[K, T]>>
) => IStorageService<Map<K, T>>

// Async

export interface IAsyncStorageService<T> {
  load: () => Promise<T>
  save: (data: T) => Promise<void>
  clear: () => Promise<void>
}

export function makeAsync<T>(
  storageService: IStorageService<T>
): IAsyncStorageService<T> {
  return {
    load: async () => storageService.load(),
    save: async (data) => {
      storageService.save(data)
    },
    clear: async () => {
      storageService.clear()
    },
  }
}

export function makeAsyncWithCodec<I, O>(
  codec: ICodecService<I, O>
): (storageService: IAsyncStorageService<O>) => IAsyncStorageService<I> {
  return (storageService) => ({
    async load() {
      return codec.decode(await storageService.load())
    },
    async save(data) {
      await storageService.save(codec.encode(data))
    },
    clear: storageService.clear.bind(storageService),
  })
}

export const asyncWithMapCodec = makeAsyncWithCodec(makeMapCodec()) as <K, T>(
  storageService: IAsyncStorageService<Array<[K, T]>>
) => IAsyncStorageService<Map<K, T>>

export function asyncWithCache<T>(
  storageService: IAsyncStorageService<T>
): IAsyncStorageService<T> {
  let cache: T | typeof UNCACHED_VALUE = UNCACHED_VALUE
  return {
    async clear() {
      cache = UNCACHED_VALUE
      await storageService.clear()
    },
    async load() {
      if (cache === UNCACHED_VALUE) {
        cache = await storageService.load()
      }
      return cache
    },
    async save(data) {
      await storageService.save(data)
      cache = data
    },
  }
}
