import { KeqCacheRule } from './keq-cache-rule'
import { Class } from 'type-fest'
import { Eviction } from '~/constants/eviction'
import { BaseStorage } from '~/storage/base-storage'


export interface KeqCacheParameters {
  /**
   * @default Storage.MEMORY
   */
  storage?: Class<BaseStorage>

  /**
   * byte
   *
   * @default 2MB
   */
  maxStorageSize?: number

  /**
   * @default Eviction.VOLATILE_TTL
   */
  eviction?: Eviction

  rules: KeqCacheRule[]
}
