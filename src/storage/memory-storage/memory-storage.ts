import { Promisable } from 'type-fest'
import { Eviction } from '~/constants/eviction.enum.js'
import { BaseStorage } from '../base-storage.js'
import { TTLMemoryStorage } from './ttl-memory-storage.js'
import { CacheEntry } from '~/types/cache-entry.js'
import { RandomMemoryStorage } from './random-memory-storage.js'
import { LRUMemoryStorage } from './lru-memory-storage.js'
import { LFUMemoryStorage } from './lfu-memory-storage.js'
import { MemoryStorageOptions } from '~/types/storage-options.js'

export class MemoryStorage extends BaseStorage {
  private storage: BaseStorage

  constructor(options?: MemoryStorageOptions) {
    super(options)

    if (this.__eviction__ === Eviction.TTL) {
      this.storage = new TTLMemoryStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.RANDOM) {
      this.storage = new RandomMemoryStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.LRU) {
      this.storage = new LRUMemoryStorage(this.__options__)
    } else if (this.__eviction__ === Eviction.LFU) {
      this.storage = new LFUMemoryStorage(this.__options__)
    } else {
      throw new TypeError(`Invalid eviction: ${String(this.__eviction__)}`)
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
