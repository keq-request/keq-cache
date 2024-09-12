import { BaseStorage } from '~/storage/keq-cache-storage'
import { KeqCacheEviction } from './keq-cache-eviction'


export class VolatileTTL extends KeqCacheEviction {
  async evict(storage: BaseStorage, size: number): Promise<void> {
    const cursor = storage.createCursor('ttl', 'asc')

    let s = cursor.value?.size || 0

    while (s < size && cursor.value) {
      s += cursor.value?.size || 0
      await storage.remove(cursor.value.key)
      await cursor.next()
    }
  }
}
