import { Eviction } from '~/constants/eviction'
import { BaseStorage } from '../base-storage'
import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry'

import { AllKeysRandomIndexedDBStorage } from './all-keys-random-indexed-db-storage'
import { AllKeysLFUIndexedDBStorage } from './all-keys-lfu-indexed-db-storage'
import { AllKeysLRUIndexedDBStorage } from './all-keys-lru-indexed-db-storage'
import { VolatileTTLIndexedDBStorage } from './volatile-ttl-indexed-db-storage'


export class IndexedBdStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(size: number, threshold: number, eviction: Eviction) {
    super(size, threshold, eviction)

    if (eviction === Eviction.ALL_KEYS_RANDOM) {
      this.storage = new AllKeysRandomIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.ALL_KEYS_LFU) {
      this.storage = new AllKeysLFUIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.ALL_KEYS_LRU) {
      this.storage = new AllKeysLRUIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.VOLATILE_TTL) {
      this.storage = new VolatileTTLIndexedDBStorage(size, threshold, eviction)
    } else {
      throw TypeError(`Not Supported Eviction: ${String(eviction!)}`)
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
