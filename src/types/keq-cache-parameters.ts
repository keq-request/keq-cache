import { BaseStorage } from '~/storage/keq-cache-storage'
import { KeqCacheRule } from './keq-cache-rule'
import { Class } from 'type-fest'
import { Eviction } from '~/constants/eviction'


export interface KeqCacheParameters {
  /**
   * @default Storage.MEMORY
   */
  storage?: Class<BaseStorage>

  /**
   * @default 2MB
   */
  maxStorageSize?: number

  /**
   * @default Eviction.VOLATILE_TTL
   */
  eviction?: Eviction

  rules: KeqCacheRule[]
}
