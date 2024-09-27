import { CacheEntry } from './cache-entry'


export interface IndexedDBCacheEntry extends Omit<CacheEntry, 'response'> {
  responseBody: ArrayBuffer
  responseHeaders: Headers
  responseStatus: number
}
