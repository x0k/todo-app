import { type ISyncStorage } from '@/models/storage'

export class PersistentSyncStorageService<T> implements ISyncStorage<T> {
  constructor(
    private readonly store: Storage,
    private readonly key: string,
    private readonly defaultValue: T
  ) {}

  load(): T {
    const storedValue = this.store.getItem(this.key)
    if (storedValue === null) {
      return this.defaultValue
    }
    try {
      const jsonValue = JSON.parse(storedValue)
      return jsonValue as T
    } catch {
      return this.defaultValue
    }
  }

  save(data: T): void {
    this.store.setItem(this.key, JSON.stringify(data))
  }

  clear(): void {
    this.store.removeItem(this.key)
  }
}
