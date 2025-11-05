import { KeqContext } from 'keq'


export interface KeqCacheEvents {
  onNetworkResponse?: (response: Response, cache?: Response) => void
  onCacheHit?: (cache: Response, context: KeqContext) => void
  onCacheMiss?: (context: KeqContext) => void
}
