import { KeqCacheEviction } from './keq-cache-eviction'
import { CacheEntry } from '~/types/cache-entry'


export class VolatileTTL extends KeqCacheEviction {
  add(key: string, entry: CacheEntry): void {
    entry.visitAt = new Date().toISOString()
    this.storage.add(key, entry)
  }

  remove(key: string): void {
    this.storage.remove(key)
  }

  has(key: string): boolean {
    return this.storage.has(key)
  }

  get(key: string): CacheEntry | undefined {
    const entry = this.storage.get(key)
    if (!entry) return
    this.storage.update(key, 'visitAt', new Date().toISOString())
    return entry
  }
}
