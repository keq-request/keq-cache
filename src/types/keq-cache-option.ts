import { KeqContext } from 'keq'
import { Strategy } from '~/constants/strategy'


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
