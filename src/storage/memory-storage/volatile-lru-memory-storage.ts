import dayjs from 'dayjs'
import { CacheEntry } from '~/types/cache-entry.js'
import { BaseVolatileMemoryStorage } from './base-volatile-memory-storage.js'


export class VolatileLRUMemoryStorage extends BaseVolatileMemoryStorage {
  protected free(arr: CacheEntry[], size: number): void {
    let freedSize = 0
    arr.sort((a, b) => (dayjs(a.visitAt).isBefore(dayjs(b.visitAt)) ? 1 : -1))

    while (freedSize < size && arr.length) {
      const item = arr.pop()!
      freedSize += item.size
      this.remove(item.key)
    }
  }
}
