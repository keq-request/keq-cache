import dayjs from 'dayjs'
import * as R from 'ramda'
import { CacheEntry } from '~/types/cache-entry.js'
import { BaseMemoryStorage } from './base-memory-storage.js'


export class TTLMemoryStorage extends BaseMemoryStorage {
  protected free(arr: CacheEntry[], size: number): void {
    const items = arr
      .sort((a, b) => {
        if (!a.expiredAt && !b.expiredAt) {
          return dayjs(a.createAt).isBefore(b.createAt) ? 1 : -1
        }

        if (!a.expiredAt) return -1
        if (!b.expiredAt) return 1

        return dayjs(a.expiredAt).isBefore(b.expiredAt) ? 1 : -1
      })

    let freedSize = 0
    while (freedSize < size && items.length) {
      const item = items.pop()!
      freedSize += item.size
      this.remove(item.key)
    }
  }

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
