import { CacheEntry } from '~/types/cache-entry'
import { BaseStorage } from './base-storage'
import dayjs from 'dayjs'


export class AllKeysLRUMemoryStorage extends BaseStorage {
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

  private free(arr: CacheEntry[], size: number): void {
    let freedSize = 0
    arr.sort((a, b) => (dayjs(a.visitAt).isBefore(dayjs(b.visitAt)) ? 1 : -1))

    while (freedSize < size && arr.length) {
      const item = arr.pop()!
      freedSize += item.size
      this.remove(item.key)
    }
  }

  evict(size: number): void {
    if ((this.__size__ - this.sizeOccupied) > size) return

    this.clearTTL()
    if ((this.__size__ - this.sizeOccupied) > size) return

    const items = [...this.volatile.values(), ...this.permanent.values()]
    this.free(items, size - (this.__size__ - this.sizeOccupied))
  }
}
