import { KeqContext } from 'keq'
import { Class } from 'type-fest'
import { KeqCacheRule } from './keq-cache-rule.js'
import { Eviction } from '~/constants/eviction.js'
import { BaseStorage } from '~/storage/base-storage.js'


export interface KeqCacheParameters {
  /**
   * @default Storage.MEMORY
   */
  storage?: Class<BaseStorage>

  /**
   * byte
   *
   * @default Infinity
   */
  maxStorageSize?: number

  /**
   * If a request size is greater than threshold, it will not be cached.
   * @default maxStorageSize * 0.2
   */
  threshold?: number

  /**
   * @default Eviction.TTL
   */
  eviction?: Eviction

  /**
   * Cache Key Factory
   */
  keyFactory?: (context: KeqContext) => string

  rules?: KeqCacheRule[]
}
