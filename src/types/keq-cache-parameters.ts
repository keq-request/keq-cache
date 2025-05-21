import { KeqContext } from 'keq'
import { KeqCacheRule } from './keq-cache-rule.js'
import { BaseStorage } from '~/storage/base-storage.js'


export interface KeqCacheParameters {
  storage: BaseStorage

  /**
   * Cache Key Factory
   */
  keyFactory?: (context: KeqContext) => string

  rules?: KeqCacheRule[]
}
