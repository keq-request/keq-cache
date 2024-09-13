import * as R from 'ramda'
import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import dayjs from 'dayjs'
import { getResponseBytes } from '~/utils/get-response-bytes'


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

  for (const i of R.range(0, 10)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `key_${i}`,
      createAt: dayjs().toISOString(),
      visitAt: dayjs().toISOString(),
      visitCount: 1,
      response,
      size,
      expiredAt: dayjs()
        .add(i, 'minute')
        .toISOString(),
    })
  }

  const key_0 = await storage.get('key_0')
  expect(key_0).toBeUndefined()

  const key_1 = await storage.get('key_1')
  expect(key_1).toBeDefined()
  expect(await key_1?.response.text()).toBe('hello world')

  expect(await storage.length()).toBe(9)
})
