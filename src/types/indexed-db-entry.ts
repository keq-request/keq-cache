import { CacheEntry } from './cache-entry.js'


export type IndexedDBEntry = Omit<CacheEntry, 'response'>

