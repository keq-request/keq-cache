import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import { getResponseBytes } from '~/utils/get-response-bytes'


test('new MemoryStorage(Infinity, Infinity, Eviction.VOLATILE_TTL)', async () => {
  const storage = new MemoryStorage(Infinity, Infinity, Eviction.TTL)
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

  // @ts-ignore
  expect(() => new MemoryStorage(Infinity, Infinity, 'xxxx')).toThrowError()
})
