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

test.only('new IndexedDBStorage({ size: 100, threshold: 20, eviction: Eviction.TTL })', async () => {
  const storage = new IndexedDBStorage({
    size: 100,
    eviction: Eviction.TTL,
  })

  await appendExpiringItem(storage, 10)
  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  await appendPermanentItem(storage, 10)
  expect(await storage.length()).toBe(9)

  for (let i = 0; i < 10; i++) {
    const temp = await storage.get(`temp_${i}`)
    expect(temp).toBeUndefined()
  }

  const per_0 = await storage.get('per_0')
  expect(per_0).toBeUndefined()
})
