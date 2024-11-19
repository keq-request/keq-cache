import { CacheEntry } from '~/types/cache-entry.js'
import { BaseStorage } from '../base-storage.js'
import { IDBPDatabase, IDBPTransaction, openDB } from 'idb'
import dayjs from 'dayjs'
import { IndexedDBSchema } from '~/types/indexed-db-schema'


export abstract class BaseIndexedDBStorage extends BaseStorage {
  private tableName = 'keq_cache_indexed_db_storage'
  private db?: IDBPDatabase<IndexedDBSchema>

  protected async getDB(): Promise<IDBPDatabase<IndexedDBSchema>> {
    if (this.db) return this.db
    const tableName = this.tableName

    const db = await openDB<IndexedDBSchema>(tableName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('entries')) {
          const entriesStore = db.createObjectStore('entries', { keyPath: 'key' })
          entriesStore.createIndex('visitAt', 'visitAt')
          entriesStore.createIndex('visitCount', 'visitCount')
          entriesStore.createIndex('expiredAt', 'expiredAt')
        }

        if (!db.objectStoreNames.contains('responses')) {
          const responsesStore = db.createObjectStore('responses', { keyPath: 'key' })
          responsesStore.createIndex('responseStatus', 'responseStatus')
        }
      },

      blocked() {
        console.error(`IndexedDB Table ${tableName} is blocked`)
      },

      blocking() {
        console.error(`IndexedDB Table ${tableName} is blocking`)
      },

      terminated() {
        console.error(`IndexedDB Table ${tableName} is terminated`)
      },
    })

    this.db = db
    return db
  }

  protected async getSizeOccupied(): Promise<number> {
    const db = await this.getDB()
    const entries = await db.getAll('entries')
    return entries.reduce((acc, entry) => acc + entry.size, 0)
  }

  protected async getSizeUnoccupied(): Promise<number> {
    const sizeOccupied = await this.getSizeOccupied()
    return this.__size__ - sizeOccupied
  }

  async length(): Promise<number> {
    const db = await this.getDB()
    return db.count('entries')
  }

  async has(key: string): Promise<boolean> {
    const db = await this.getDB()
    const item = await db.getKey('entries', key)
    return !!item
  }

  async get(key: string): Promise<CacheEntry | undefined> {
    const db = await this.getDB()
    const entry = await db.get('entries', key)
    const res = await db.get('responses', key)

    if (!entry || !res) return

    const response = new Response(res.responseBody, {
      status: res.responseStatus,
      headers: res.responseHeaders,
      statusText: res.responseStatusText,
    })

    return { ...entry, response }
  }

  async add(entry: CacheEntry): Promise<void> {
    const db = await this.getDB()
    const { response, ...rest } = entry
    if (!rest.expiredAt) rest.expiredAt = new Date(8640000000000000)

    const tx = db.transaction(['entries', 'responses'], 'readwrite')
    await tx.objectStore('entries').add(rest)

    await tx.objectStore('responses').add({
      key: entry.key,
      responseBody: await response.arrayBuffer(),
      responseHeaders: new Headers(response.headers),
      responseStatus: response.status,
      responseStatusText: response.statusText,
    })

    await tx.done
  }

  protected async __remove__(tx: IDBPTransaction<IndexedDBSchema, ('entries' | 'responses')[], 'readwrite'>, key: string): Promise<void> {
    await tx.objectStore('entries').delete(key)
    await tx.objectStore('responses').delete(key)
  }

  async remove(key: string): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(['entries', 'responses'], 'readwrite')
    await this.__remove__(tx, key)
    await tx.done
  }

  async update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(['entries', 'responses'], 'readwrite')

    const item = await tx.objectStore('entries').get(key)
    if (!item) {
      await tx.abort()
      return
    }

    item[prop] = value
    await db.put('entries', item)
    await tx.done
  }

  protected async removeOutdated(): Promise<void> {
    const now = dayjs()

    const db = await this.getDB()
    const tx = db.transaction('entries', 'readwrite')
    let cursor = await tx.store.index('expiredAt').openCursor(IDBKeyRange.upperBound(now.valueOf()))

    while (cursor) {
      await cursor.delete()
      cursor = await cursor.continue()
    }
  }
}

