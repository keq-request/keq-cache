import { CacheEntry } from './cache-entry'


export type IndexedDBEntry = Omit<CacheEntry, 'response'>

