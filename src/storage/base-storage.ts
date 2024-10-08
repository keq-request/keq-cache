import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry.js'
import { Eviction } from '~/constants/eviction.js'

export abstract class BaseStorage {
  constructor(
    protected readonly __size__: number,
    protected readonly __threshold__: number,
    protected readonly __eviction__: Eviction,
  ) {}

  abstract length(): Promisable<number>

  abstract has(key: string): Promisable<boolean>
  abstract get(key: string): Promisable<CacheEntry | undefined>
  abstract add(entry: CacheEntry): Promisable<void>
  abstract remove(key: string): Promisable<void>
  abstract update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promisable<void>

  abstract evict(size: number): Promisable<void>
}
