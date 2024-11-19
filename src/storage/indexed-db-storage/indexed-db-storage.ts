import { Eviction } from '~/constants/eviction'
import { BaseStorage } from '../base-storage'
import { Promisable } from 'type-fest'
import { CacheEntry } from '~/types/cache-entry'

import { RandomIndexedDBStorage } from './random-indexed-db-storage.js'
import { LFUIndexedDBStorage } from './lfu-indexed-db-storage.js'
import { LRUIndexedDBStorage } from './lru-indexed-db-storage.js'
import { TTLIndexedDBStorage } from './ttl-indexed-db-storage.js'


export class IndexedDBStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(size: number, threshold: number, eviction: Eviction) {
    super(size, threshold, eviction)

    if (eviction === Eviction.RANDOM) {
      this.storage = new RandomIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.LFU) {
      this.storage = new LFUIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.LRU) {
      this.storage = new LRUIndexedDBStorage(size, threshold, eviction)
    } else if (eviction === Eviction.TTL) {
      this.storage = new TTLIndexedDBStorage(size, threshold, eviction)
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
