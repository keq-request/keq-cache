export interface KeqCacheEvents {
  onNetworkResponse?: (response: Response, cache?: Response) => void
  onCacheHit?: (cache: Response) => void
  onCacheMiss?: () => void
}
