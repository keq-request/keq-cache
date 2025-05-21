import { expect, test } from '@jest/globals'
import { IndexedDBStorage } from './indexed-db-storage'
import { Eviction } from '~/constants/eviction.enum'
import { appendExpiringItem, appendPermanentItem } from '~~/__tests__/helpers'
import { beforeEach } from 'node:test'
import { openDB } from 'idb'


beforeEach(async () => {
  const db = await openDB('keq_cache_indexed_db_storage')
  await db.deleteObjectStore('entries')
  await db.deleteObjectStore('responses')
})

test('new IndexedDBStorage(100, 20, Eviction.RANDOM)', async () => {
  const storage = new IndexedDBStorage({
    size: 100,
    eviction: Eviction.RANDOM,
  })

  await appendExpiringItem(storage, 10)
  expect(await storage.length()).toBe(9)

  await appendPermanentItem(storage, 10)
  expect(await storage.length()).toBe(9)
})
