export interface IStorageService<T> {
  load: () => T
  save: (data: T) => void
  clear: () => void
}

export interface IAsyncStorageService<T> {
  load: () => Promise<T>
  save: (data: T) => Promise<void>
  clear: () => Promise<void>
}

export interface ICodecService<I, O> {
  decode: (data: O) => I
  encode: (data: I) => O
}

export function makeWithCodec<I, O>(
  codec: ICodecService<I, O>
): (storageService: IAsyncStorageService<O>) => IAsyncStorageService<I> {
  return (storageService) => ({
    clear: storageService.clear.bind(storageService),
    async load() {
      return codec.decode(await storageService.load())
    },
    async save(data) {
      await storageService.save(codec.encode(data))
    },
  })
}

export function makeMapCodec<I>(): ICodecService<
  Map<string, I>,
  Array<[string, I]>
>
export function makeMapCodec<I, O>(
  valueCodec: ICodecService<I, O>
): ICodecService<Map<string, I>, Array<[string, O]>>
export function makeMapCodec<I, O = I>(
  valueCodec?: ICodecService<I, O>
): ICodecService<Map<string, I>, Array<[string, O]>> {
  return valueCodec != null
    ? {
        encode: (data): Array<[string, O]> => {
          const entries = Array.from(data)
          return entries.map((e) => [e[0], valueCodec.encode(e[1])])
        },
        decode: (data) =>
          new Map(data.map((e) => [e[0], valueCodec.decode(e[1])])),
      }
    : {
        encode: (data) => Array.from(data) as unknown as Array<[string, O]>,
        decode: (data) => new Map(data as unknown as Array<[string, I]>),
      }
}

export const withMapCodec = makeWithCodec(makeMapCodec()) as <T>(
  storageService: IAsyncStorageService<Array<[string, T]>>
) => IAsyncStorageService<Map<string, T>>

const UNCACHED_VALUE = Symbol('Uncached value')

export function withCache<T>(
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
