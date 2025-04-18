import { KeqContext } from 'keq'
import { Strategy } from '~/constants/strategy.js'
import { KeqCacheEvents } from './keq-cache-events'


export interface KeqCacheOption extends KeqCacheEvents {
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
