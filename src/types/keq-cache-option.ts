import { Strategy } from '~/constants/strategy'
import { Eviction } from '~/constants/eviction'


export interface KeqCacheOption {
  /**
   * @default Strategy.NETWORK_FIRST
   */
  strategy?: Strategy

  /**
   * @default Eviction.VOLATILE_TTL
   */
  eviction?: Eviction

  /**
   * @default Infinity
   */
  ttl?: number
}
