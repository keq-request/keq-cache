import * as R from 'ramda'
import { CacheEntry } from '~/types/cache-entry.js'
import { BaseMemoryStorage } from './base-memory-storage.js'


export abstract class BaseVolatileMemoryStorage extends BaseMemoryStorage {
  protected abstract free(arr: CacheEntry[], size: number): void


  evict(size: number): void {
    if ((this.__size__ - this.sizeOccupied) > size) return

    this.removeOutdated()
    if ((this.__size__ - this.sizeOccupied) > size) return

    const volatile = [...this.volatile.values()]
    const totalVolatileSize = R.sum(R.pluck('size', volatile))

    if (totalVolatileSize < (size - this.sizeUnoccupied)) {
      for (const item of volatile) {
        this.remove(item.key)
      }

      const permanent = [...this.permanent.values()]
      this.free(permanent, size - this.sizeUnoccupied)
    } else {
      this.free(volatile, size - this.sizeUnoccupied)
    }
  }
}

