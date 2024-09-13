import { CacheEntry } from '~/types/cache-entry'
import { BaseStorage } from './base-storage'
import dayjs from 'dayjs'


export class VolatileTTLMemoryStorage extends BaseStorage {
  private permanent = new Map<string, CacheEntry>()
  private volatile = new Map<string, CacheEntry>()
  private sizeOccupied = 0

  length(): number {
    return [...this.volatile.keys(), ...this.permanent.keys()].length
  }

  add(entry: CacheEntry): void {
    if (entry.size > this.__threshold__) return
    if (entry.expiredAt) {
      this.volatile.set(entry.key, { ...entry, response: entry.response.clone() })
    } else {
      this.permanent.set(entry.key, { ...entry, response: entry.response.clone() })
    }

    this.sizeOccupied += entry.size
  }

  private find(key: string): CacheEntry | undefined {
    let entry = this.volatile.get(key)
    if (!entry) entry = this.permanent.get(key)

    return entry
  }

  remove(key: string): void {
    const entry = this.find(key)
    if (!entry) return

    if (entry.expiredAt) this.volatile.delete(key)
    else this.permanent.delete(key)

    this.sizeOccupied -= entry.size
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.find(key)
    if (!entry) return undefined
    return { ...entry, response: entry.response.clone() }
  }

  has(key: string): boolean {
    return !!this.find(key)
  }

  update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): void {
    const entry = this.find(key)
    if (!entry) return
    entry[prop] = value
  }

  private clearTTL(): void {
    const now = dayjs()
    for (const [key, entry] of this.volatile.entries()) {
      if (entry.expiredAt && now.isAfter(entry.expiredAt)) {
        this.remove(key)
      }
    }
  }

  evict(size: number): void {
    if ((this.__size__ - this.sizeOccupied) > size) return

    this.clearTTL()
    if ((this.__size__ - this.sizeOccupied) > size) return


    const items = [...this.volatile.values(), ...this.permanent.values()]
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
