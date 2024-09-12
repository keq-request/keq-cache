import { Strategy } from '~/constants/strategy'


export interface KeqCacheOption {
  /**
   * @default Strategy.NETWORK_FIRST
   */
  strategy?: Strategy

  /**
   * @default Infinity
   */
  ttl?: number
}
