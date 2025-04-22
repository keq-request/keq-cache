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

  /**
   * If exclude is true, the request will not be cached.
   */
  exclude?: (res: Response) => (Promise<boolean> | boolean)
}
