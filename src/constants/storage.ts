import { IndexedDBStorage } from '~/storage/indexed-db-storage/indexed-db-storage'
import { MemoryStorage } from '~/storage/memory-storage/memory-storage.js'


export const Storage = {
  MEMORY: MemoryStorage,
  INDEXED_DB: IndexedDBStorage,
}
