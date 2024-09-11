import * as R from 'ramda'
import { CacheEntry } from '~/types/cache-entry'
import { KeqCacheStorage } from './keq-cache-storage'


export class KeqCacheMemoryStorage extends KeqCacheStorage {
  private storage = new Map<string, CacheEntry>()

  getSummary(): Omit<CacheEntry, 'response'>[] {
    return [...this.storage.values()]
      .map((item) => R.omit(['response'], item))
  }

  size(): number {
    return R.sum(R.pluck('size', [...this.storage.values()]))
  }

  add(key: string, entry: CacheEntry): void {
    this.storage.set(key, entry)
  }

  remove(key: string): void {
    this.storage.delete(key)
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.storage.get(key)
    if (!entry) return undefined

    return { ...entry, response: entry.response.clone() }
  }

  has(key: string): boolean {
    return this.storage.has(key)
  }

  update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): void {
    const entry = this.storage.get(key)
    if (!entry) return
    entry[prop] = value
  }
}
