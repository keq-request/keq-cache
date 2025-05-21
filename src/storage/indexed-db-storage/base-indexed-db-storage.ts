import * as R from 'ramda'
import { CacheEntry } from '~/types/cache-entry.js'
import { BaseStorage } from '../base-storage.js'
import { IDBPDatabase, IDBPTransaction, openDB } from 'idb'
import dayjs from 'dayjs'
import { IndexedDBSchema } from '~/types/indexed-db-schema.js'
import { IndexedDBResponse } from '~/types/indexed-db-response.js'
import { IndexedDBEntry } from '~/types/indexed-db-entry.js'
import { IndexedDbStorageOptions } from '~/types/storage-options.js'


export abstract class BaseIndexedDBStorage extends BaseStorage {
  private __name__: string
  private db?: IDBPDatabase<IndexedDBSchema>

  get tableName(): string {
    return `keq_cache_indexed_db_storage__${this.__name__}`
  }

  constructor(options?: IndexedDbStorageOptions) {
    super(options)
    if (options?.name === 'default') {
      throw new TypeError('[keq-cache] IndexedDBStorage name cannot be "default"')
    }

    this.__name__ = options?.name || 'default'
  }

  protected async openDB(): Promise<IDBPDatabase<IndexedDBSchema>> {
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
    const db = await this.openDB()
    const entries = await db.getAll('entries')
    return entries.reduce((acc, entry) => acc + entry.size, 0)
  }

  protected async getSizeUnoccupied(): Promise<number> {
    const sizeOccupied = await this.getSizeOccupied()
    return this.__size__ - sizeOccupied
  }

  async length(): Promise<number> {
    try {
      const db = await this.openDB()
      return db.count('entries')
    } catch (error) {
      return 0
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const db = await this.openDB()
      const item = await db.getKey('entries', key)
      return !!item
    } catch (error) {
      return false
    }
  }

  async get(key: string): Promise<CacheEntry | undefined> {
    try {
      const db = await this.openDB()
      const entry = await db.get('entries', key)
      const res = await db.get('responses', key)

      if (!entry || !res) return

      const response = new Response(res.responseBody, {
        status: res.responseStatus,
        headers: new Headers(res.responseHeaders),
        statusText: res.responseStatusText,
      })

      return { ...entry, response }
    } catch (error) {
      return
    }
  }

  async add(entry: CacheEntry): Promise<void> {
    try {
      const { ...rest } = entry
      const response = entry.response.clone()
      if (!rest.expiredAt) rest.expiredAt = new Date(8640000000000000)

      const entryValue: IndexedDBEntry = R.omit(['response'], rest)

      const responseValue: IndexedDBResponse = {
        key: entry.key,
        responseBody: await response.arrayBuffer(),
        responseHeaders: [...response.headers.entries()],
        responseStatus: response.status,
        responseStatusText: response.statusText,
      }


      const db = await this.openDB()
      const tx = db.transaction(['entries', 'responses'], 'readwrite')
      const eStore = await tx.objectStore('entries')
      const resStore = await tx.objectStore('responses')

      if (await eStore.get(entry.key)) await eStore.put(entryValue)
      else await eStore.add(entryValue)

      if (await resStore.get(entry.key)) await resStore.put(responseValue)
      else await resStore.add(responseValue)

      await tx.done
    } catch (error) {
      return
    }
  }

  protected async __remove__(tx: IDBPTransaction<IndexedDBSchema, ('entries' | 'responses')[], 'readwrite'>, key: string): Promise<void> {
    await tx.objectStore('entries').delete(key)
    await tx.objectStore('responses').delete(key)
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(['entries', 'responses'], 'readwrite')
      await this.__remove__(tx, key)
      await tx.done
    } catch (error) {
      return
    }
  }

  async update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promise<void> {
    try {
      const db = await this.openDB()
      const tx = db.transaction(['entries', 'responses'], 'readwrite')

      const item = await tx.objectStore('entries').get(key)
      if (!item) {
        await tx.abort()
        return
      }

      item[prop] = value
      await db.put('entries', item)
      await tx.done
    } catch (error) {
      return
    }
  }

  protected async removeOutdated(): Promise<void> {
    try {
      const now = dayjs()

      const db = await this.openDB()
      const tx = db.transaction('entries', 'readwrite')
      let cursor = await tx.store.index('expiredAt')
        .openCursor(IDBKeyRange.upperBound(now.valueOf()))

      while (cursor) {
        await cursor.delete()
        cursor = await cursor.continue()
      }
    } catch (error) {
      return
    }
  }
}

