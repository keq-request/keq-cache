import { CacheEntry } from '~/types/cache-entry'
import { Promisable } from 'type-fest'
import { Eviction } from '~/constants/eviction'

export abstract class BaseStorage {
  constructor(
    protected readonly __size__: number,
    protected readonly __eviction__: Eviction,
  ) {}

  abstract has(key: string): Promisable<boolean>
  abstract get(key: string): Promisable<CacheEntry | undefined>
  abstract add(key: string, entry: CacheEntry): Promisable<void>
  abstract remove(key: string): Promisable<void>
  abstract update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promisable<void>

  abstract evict(size: number): Promisable<void>
}
