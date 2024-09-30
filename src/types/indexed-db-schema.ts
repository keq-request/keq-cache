import { DBSchema } from 'idb'
import { IndexedDBEntry } from './indexed-db-entry'
import { IndexedDBResponse } from './indexed-db-response'


export interface IndexedDBSchema extends DBSchema {
  entries: {
    key: string
    value: IndexedDBEntry
    indexes: {
      visitAt: string
      visitCount: number
      expiredAt: string
    }
  }
  responses: {
    key: string
    value: IndexedDBResponse
    indexes: {
      responseStatus: number
    }
  }
}
