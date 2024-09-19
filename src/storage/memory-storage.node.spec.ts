import * as R from 'ramda'
import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import dayjs from 'dayjs'
import { getResponseBytes } from '~/utils/get-response-bytes'

async function appendExpiringItem(storage: MemoryStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `temp_${i}`,
      createAt: dayjs().toISOString(),
      visitAt: dayjs()
        .add(i, 'minute')
        .toISOString(),

      visitCount: 1 + i,
      response,
      size,
      expiredAt: dayjs()
        .add(i + 100, 'minute')
        .toISOString(),
    })
  }
}

async function appendPermanentItem(storage: MemoryStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `pre_${i}`,
      createAt: dayjs().toISOString(),
      visitAt: dayjs().toISOString(),
      visitCount: 1,
      response,
      size,
    })
  }
}


test('new MemoryStorage(Infinity, Eviction.VOLATILE_TTL)', async () => {
  const storage = new MemoryStorage(Infinity, Infinity, Eviction.VOLATILE_TTL)
  const response = new Response('hello world', { status: 200 })

  await storage.add({
    key: 'key',
    createAt: dayjs().toISOString(),
    visitAt: dayjs().toISOString(),
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


test('new MemoryStorage(100, Eviction.VOLATILE_TTL)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_TTL)

  await appendExpiringItem(storage, 10)

  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  const temp_1 = await storage.get('temp_1')
  expect(temp_1).toBeDefined()
  expect(await temp_1?.response.text()).toBe('hello world')

  expect(await storage.length()).toBe(9)
})


test('new MemoryStorage(100, Eviction.VOLATILE_RANDOM)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.VOLATILE_RANDOM)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)

  await appendPermanentItem(storage, 10)

  expect(await storage.length()).toBe(9)
  for (const i of R.range(0, 10)) {
    expect(storage.get(`key_${i}`)).toBeUndefined()
  }
})


test('new MemoryStorage(100, Eviction.ALL_KEYS_RANDOM)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_RANDOM)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
})


test('new MemoryStorage(100, Eviction.ALL_KEYS_LRU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_LRU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})


test.only('new MemoryStorage(100, Eviction.ALL_KEYS_LFU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.ALL_KEYS_LFU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})
