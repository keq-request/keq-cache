import dayjs from 'dayjs'
import { CacheEntry } from '~/types/cache-entry.js'
import { BaseVolatileMemoryStorage } from './base-volatile-memory-storage.js'


export class VolatileTTLMemoryStorage extends BaseVolatileMemoryStorage {
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
}
