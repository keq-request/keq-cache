import { Eviction } from '~/constants/eviction'
import { BaseStorage } from './base-storage'
import { VolatileTTLMemoryStorage } from './volatile-ttl-memory-storage'
import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry'

export class MemoryStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(size: number, eviction: Eviction) {
    super(size, eviction)

    if (eviction === Eviction.VOLATILE_TTL) {
      this.storage = new VolatileTTLMemoryStorage(size, eviction)
    } else {
      throw TypeError(`Not Supported Eviction: ${eviction}`)
    }
  }

  add(key: string, entry: CacheEntry): Promisable<void> {
    return this.storage.add(key, entry)
  }

  get(key: string): Promisable<CacheEntry | undefined> {
    return this.storage.get(key)
  }

  has(key: string): Promisable<boolean> {
    return this.storage.has(key)
  }

  remove(key: string): Promisable<void> {
    return this.storage.remove(key)
  }

  update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promisable<void> {
    return this.storage.update(key, prop, value)
  }

  evict(size: number): Promisable<void> {
    return this.storage.evict(size)
  }
}
