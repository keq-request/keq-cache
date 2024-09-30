import * as R from 'ramda'
import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import { getResponseBytes } from '~/utils/get-response-bytes'
import { appendExpiringItem, appendPermanentItem } from '~~/__tests__/helpers'


test('new MemoryStorage(Infinity, Infinity, Eviction.VOLATILE_TTL)', async () => {
  const storage = new MemoryStorage(Infinity, Infinity, Eviction.VOLATILE_TTL)
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
})


test('new MemoryStorage(100, 20, Eviction.VOLATILE_TTL)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_TTL)

  await appendExpiringItem(storage, 10)

  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  const temp_1 = await storage.get('temp_1')
  expect(temp_1).toBeDefined()
  expect(await temp_1?.response.text()).toBe('hello world')

  expect(await storage.length()).toBe(9)
})


test('new MemoryStorage(100, 20, Eviction.VOLATILE_RANDOM)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_RANDOM)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)

  await appendPermanentItem(storage, 10)

  expect(await storage.length()).toBe(9)
  for (const i of R.range(0, 10)) {
    expect(storage.get(`temp_${i}`)).toBeUndefined()
  }
})


test('new MemoryStorage(100, 20, Eviction.ALL_KEYS_RANDOM)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_RANDOM)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
})


test('new MemoryStorage(100, 20, Eviction.ALL_KEYS_LRU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_LRU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})


test('new MemoryStorage(100, 20, Eviction.ALL_KEYS_LFU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_LFU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})

test('new MemoryStorage(100, 20, Eviction.VOLATILE_LRU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_LRU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  await appendPermanentItem(storage, 10)
  expect(await storage.length()).toBe(9)
  for (const i of R.range(0, 10)) {
    expect(storage.get(`temp_${i}`)).toBeUndefined()
  }
  const per_0 = await storage.get('per_0')
  expect(per_0).toBeUndefined()
})

test('new MemoryStorage(100, 20, Eviction.VOLATILE_LFU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_LFU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  await appendPermanentItem(storage, 10)
  expect(await storage.length()).toBe(9)
  for (const i of R.range(0, 10)) {
    expect(storage.get(`temp_${i}`)).toBeUndefined()
  }
  const per_0 = await storage.get('per_0')
  expect(per_0).toBeUndefined()
})
