import { KeqCacheStorage } from '~/storage/keq-cache-storage'
import { KeqCacheRule } from './keq-cache-rule'
import { Class } from 'type-fest'


export interface KeqCacheParameters {
  /**
   * @default Storage.MEMORY
   */
  storage?: Class<KeqCacheStorage>

  /**
   * @default 2MB
   */
  maxStorageSize?: number

  rules: KeqCacheRule[]
}
