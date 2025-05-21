import { Promisable } from 'type-fest'
import { Eviction } from '~/constants/eviction.enum.js'
import { BaseStorage } from '../base-storage.js'
import { CacheEntry } from '~/types/cache-entry.js'

import { RandomIndexedDBStorage } from './random-indexed-db-storage.js'
import { LFUIndexedDBStorage } from './lfu-indexed-db-storage.js'
import { LRUIndexedDBStorage } from './lru-indexed-db-storage.js'
import { TTLIndexedDBStorage } from './ttl-indexed-db-storage.js'
import { IndexedDbStorageOptions } from '~/types/storage-options.js'


export class IndexedDBStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(options?: IndexedDbStorageOptions) {
    super(options)

    if (this.__eviction__ === Eviction.RANDOM) {
      this.storage = new RandomIndexedDBStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.LFU) {
      this.storage = new LFUIndexedDBStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.LRU) {
      this.storage = new LRUIndexedDBStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.TTL) {
      this.storage = new TTLIndexedDBStorage(this.__options__)
    } else {
      throw TypeError(`Not Supported Eviction: ${String(this.__eviction__!)}`)
    }
  }

  length(): Promisable<number> {
    return this.storage.length()
  }

  add(entry: CacheEntry): Promisable<void> {
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
