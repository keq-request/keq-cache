import { KeqContext } from 'keq'
import { Strategy } from '~/constants/strategy.js'


export interface KeqCacheOption {
  /**
   * Cache Key
   */
  key?: string | ((context: KeqContext) => string)

  /**
   * @default Strategy.NETWORK_FIRST
   */
  strategy: Strategy

  /**
   * @default Infinity
   */
  ttl?: number
}
