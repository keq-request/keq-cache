import { BaseStorage } from '~/storage/keq-cache-storage'


export abstract class KeqCacheEviction {
  abstract evict(storage: BaseStorage, size: number): void
}
