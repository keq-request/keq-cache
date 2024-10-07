import { Promisable } from 'type-fest'
import { Eviction } from '~/constants/eviction.js'
import { BaseStorage } from '../base-storage.js'
import { TTLMemoryStorage } from './ttl-memory-storage.js'
import { CacheEntry } from '~/types/cache-entry.js'
import { RandomMemoryStorage } from './random-memory-storage.js'
import { LRUMemoryStorage } from './lru-memory-storage.js'
import { LFUMemoryStorage } from './lfu-memory-storage.js'

export class MemoryStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(size: number, threshold: number, eviction: Eviction) {
    super(size, threshold, eviction)

    if (eviction === Eviction.TTL) {
      this.storage = new TTLMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.RANDOM) {
      this.storage = new RandomMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.LRU) {
      this.storage = new LRUMemoryStorage(size, threshold, eviction)
    } else if (eviction === Eviction.LFU) {
      this.storage = new LFUMemoryStorage(size, threshold, eviction)
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
