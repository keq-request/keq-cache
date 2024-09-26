import { CacheEntry } from '~/types/cache-entry.js'
import { BaseAllKeysMemoryStorage } from './base-all-keys-memory-storage.js'


export class AllKeysLFUMemoryStorage extends BaseAllKeysMemoryStorage {
  protected free(arr: CacheEntry[], size: number): void {
    let freedSize = 0
    arr.sort((a, b) => b.visitCount - a.visitCount)

    while (freedSize < size && arr.length) {
      const item = arr.pop()!
      freedSize += item.size
      this.remove(item.key)
    }
  }
}
