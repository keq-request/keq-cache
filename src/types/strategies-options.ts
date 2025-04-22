import { BaseStorage } from '~/storage/base-storage.js'
import { KeqCacheEvents } from './keq-cache-events'


export interface StrategyOptions extends KeqCacheEvents {
  key: string
  storage: BaseStorage
  exclude?: (res: Response) => (boolean | Promise<boolean>)
}
