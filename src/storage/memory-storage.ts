import { Eviction } from '~/constants/eviction'
import { BaseStorage } from './base-storage'
import { VolatileTTLMemoryStorage } from './volatile-ttl-memory-storage'
import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry'
import { VolatileRandomMemoryStorage } from './volatile-random-memory-storage'
import { AllKeysRandomMemoryStorage } from './all-keys-random-memory-storage'
import { AllKeysLRUMemoryStorage } from './all-keys-lru-memory-storage'
import { AllKeysLFUMemoryStorage } from './all-keys-lfu-memory-storage'
import { VolatileLRUMemoryStorage } from './volatile-lru-memory-storage'

export class MemoryStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(size: number, threshold: number, eviction: Eviction) {
    super(size, threshold, eviction)

    if (eviction === Eviction.VOLATILE_TTL) {
      this.storage = new VolatileTTLMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.VOLATILE_RANDOM) {
      this.storage = new VolatileRandomMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.ALL_KEYS_RANDOM) {
      this.storage = new AllKeysRandomMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.ALL_KEYS_LRU) {
      this.storage = new AllKeysLRUMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.ALL_KEYS_LFU) {
      this.storage = new AllKeysLFUMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.VOLATILE_LRU) {
      this.storage = new VolatileLRUMemoryStorage(size, threshold, eviction)
    } else {
      throw TypeError(`Not Supported Eviction: ${eviction}`)
    }
  }

  length(): Promisable<number> {
    return this.storage.length()
  }

  add(entry: CacheEntry): Promisable<void> {
    if (entry.size > this.__threshold__) return
    return this.storage.add(entry)
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
