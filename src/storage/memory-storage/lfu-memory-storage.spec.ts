import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import { appendExpiringItem } from '~~/__tests__/helpers'


test('new MemoryStorage(100, 20, Eviction.LFU)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.LFU)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})
