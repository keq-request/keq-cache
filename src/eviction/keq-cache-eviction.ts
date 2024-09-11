import { KeqCacheStorage } from '~/storage/keq-cache-storage'


export abstract class KeqCacheEviction {
  abstract evict(storage: KeqCacheStorage, size: number): void
}
