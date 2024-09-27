import { CacheEntry } from '~/types/cache-entry'
import { BaseStorage } from '../base-storage'
import { IDBPDatabase, openDB } from 'idb'
import { IndexedDBCacheEntry } from '~/types/indexed-db-cache-entry'


export abstract class BaseIndexedDBStorage extends BaseStorage {
  private db?: IDBPDatabase<IndexedDBCacheEntry>


  protected async getDB(): Promise<IDBPDatabase<IndexedDBCacheEntry>> {
    if (this.db) return this.db

    const db = await openDB<IndexedDBCacheEntry>('keq_cache_indexed_db_storage', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('cache')) {
          const objectStorage = db.createObjectStore('cache', { keyPath: 'key' })
          objectStorage.createIndex('visitAt', 'visitAt')
          objectStorage.createIndex('visitCount', 'visitCount')
          objectStorage.createIndex('expiredAt', 'expiredAt')
          objectStorage.createIndex('size', 'size')
        }
      },
    })

    this.db = db
    return db
  }


  async length(): Promise<number> {
    const db = await this.getDB()
    return db.count('cache')
  }

  async has(key: string): Promise<boolean> {
    const db = await this.getDB()
    const item = await db.getKey('cache', key)
    return !!item
  }

  async get(key: string): Promise<CacheEntry | undefined> {
    const db = await this.getDB()
    return await db.get('cache', key)
  }

  async add(entry: CacheEntry): Promise<void> {
    const db = await this.getDB()
    const { response, ...rest } = entry
    const responseBody = await response.arrayBuffer()
    const responseHeaders = new Headers(response.headers)

    const item: IndexedDBCacheEntry = {
      ...rest,
      responseBody,
      responseHeaders,
      responseStatus: response.status,
    }

    await db.add('cache', item)
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDB()
    await db.delete('cache', key)
  }

  async remove(key: string): Promise<void> {
    const db = await this.getDB()
    await db.delete('cache', key)
  }

  async update<T extends Exclude<keyof CacheEntry, 'response' | 'key'>>(key: string, prop: T, value: CacheEntry[T]): Promise<void> {
    const db = await this.getDB()
    const item = await db.get('cache', key)
    if (!item) return

    item[prop] = value
    await db.put('cache', item)
  }
}

