import { CacheEntry } from '~/types/cache-entry.js'
import { random } from '~/utils/random.js'
import { BaseAllKeysMemoryStorage } from './base-all-keys-memory-storage.js'


export class AllKeysRandomMemoryStorage extends BaseAllKeysMemoryStorage {
  protected free(arr: CacheEntry[], size: number): void {
    let freedSize = 0
    while (freedSize < size && arr.length) {
      const index = random(0, arr.length - 1)
      const item = arr[index]
      freedSize += item.size
      arr.splice(index, 1)
      this.remove(item.key)
    }
  }
}
