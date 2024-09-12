import { CacheEntry } from '~/types/cache-entry'
import { BaseStorage } from './base-storage'
import dayjs from 'dayjs'


export class VolatileTTLMemoryStorage extends BaseStorage {
  private storage = new Map<string, CacheEntry>()
  private sizeOccupied = 0

  add(key: string, entry: CacheEntry): void {
    this.storage.set(key, entry)
    this.sizeOccupied += entry.size
  }

  remove(key: string): void {
    const entry = this.storage.get(key)
    if (!entry) return
    this.storage.delete(key)
    this.sizeOccupied -= entry.size
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.storage.get(key)
    if (!entry) return undefined

    return { ...entry, response: entry.response.clone() }
  }

  has(key: string): boolean {
    return this.storage.has(key)
  }

  update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): void {
    const entry = this.storage.get(key)
    if (!entry) return
    entry[prop] = value
  }

  evict(size: number): void {
    if ((this.__size__ - this.sizeOccupied) > size) return

    const items = [...this.storage.values()]
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
