import { expect, test } from '@jest/globals'
import { IndexedDBStorage } from './indexed-db-storage'
import { Eviction } from '~/constants/eviction.enum'
import { getResponseBytes } from '~/utils/get-response-bytes'
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

  const response = new Response('hello world', { status: 200 })

  await storage.add({
    key: 'key',
    createAt: new Date(),
    visitAt: new Date(),
    visitCount: 1,
    response,
    size: await getResponseBytes(response.clone()),
  })

  const cache = await storage.get('key')

  expect(await cache?.response.text()).toBe('hello world')
  expect(cache?.size).toBe('hello world'.length)

  const notExistCache = await storage.get('not_exist_key')
  expect(notExistCache).toBeUndefined()

  expect(await storage.has('key')).toBeTruthy()
  expect(await storage.has('not_exist_key')).toBeFalsy()

  expect(await storage.length()).toBe(1)

  await storage.remove('key')
  expect(await storage.length()).toBe(0)
})
