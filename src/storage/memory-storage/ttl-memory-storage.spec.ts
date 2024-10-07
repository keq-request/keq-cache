import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import { appendExpiringItem, appendPermanentItem } from '~~/__tests__/helpers'


test('new MemoryStorage(100, 20, Eviction.TTL)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.TTL)

  await appendExpiringItem(storage, 10)

  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()

  const temp_1 = await storage.get('temp_1')
  expect(temp_1).toBeDefined()
  expect(await temp_1?.response.text()).toBe('hello world')

  expect(await storage.length()).toBe(9)

  await appendPermanentItem(storage, 10)
  for (let i = 0; i < 10; i++) {
    const temp = await storage.get(`temp_${i}`)
    expect(temp).toBeUndefined()
  }
})
