import { CacheEntry } from '~/types/cache-entry'

export abstract class KeqCacheStorage {
  abstract cursor(key: string, order: 'desc' | 'asc'): number

  abstract size(): number
  abstract has(key: string): boolean
  abstract get(key: string): CacheEntry | undefined
  abstract add(key: string, entry: CacheEntry): void
  abstract remove(key: string): void
  abstract update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): void
}
