import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction.enum'
import { getResponseBytes } from '~/utils/get-response-bytes'


test('new MemoryStorage({ eviction: Eviction.VOLATILE_TTL })', async () => {
  const storage = new MemoryStorage({ eviction: Eviction.TTL })

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
  await storage.update('key', 'visitCount', 10)
  expect((await storage.get('key'))?.visitCount).toBe(10)

  await storage.remove('key')
  expect(await storage.has('key')).toBeFalsy()
})

test('new MemoryStorage({ eviction: "xxxx" })', async () => {
  expect(() => new MemoryStorage({
    size: Infinity,
    // @ts-ignore
    eviction: 'xxxx',
  })).toThrowError()
})


test('MemoryStorage Isolation', async () => {
  const s1 = new MemoryStorage({ eviction: Eviction.TTL })
  const s2 = new MemoryStorage({ eviction: Eviction.TTL })

  const response = new Response('hello world', { status: 200 })
  const entry = {
    createAt: new Date(),
    visitAt: new Date(),
    visitCount: 1,
    response,
    size: await getResponseBytes(response.clone()),
  }

  await s1.add({
    key: 's1-key',
    ...entry,
  })

  await s2.add({
    key: 's2-key',
    ...entry,
  })

  expect(await s1.get('s1-key')).toBeDefined()
  expect(await s2.get('s2-key')).toBeDefined()
  expect(await s1.get('s2-key')).toBeUndefined()
  expect(await s2.get('s1-key')).toBeUndefined()
})
