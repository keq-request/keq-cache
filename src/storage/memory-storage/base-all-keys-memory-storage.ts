import { CacheEntry } from '~/types/cache-entry.js'
import { BaseMemoryStorage } from './base-memory-storage.js'


export abstract class BaseAllKeysMemoryStorage extends BaseMemoryStorage {
  protected abstract free(arr: CacheEntry[], size: number): void

  evict(size: number): void {
    if ((this.__size__ - this.sizeOccupied) > size) return

    this.removeOutdated()
    if ((this.__size__ - this.sizeOccupied) > size) return

    const items = [...this.volatile.values(), ...this.permanent.values()]
    this.free(items, size - (this.__size__ - this.sizeOccupied))
  }
}
