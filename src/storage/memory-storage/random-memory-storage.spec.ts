import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction'
import { appendExpiringItem } from '~~/__tests__/helpers'


test('new MemoryStorage(100, 20, Eviction.RANDOM)', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.RANDOM)

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
})
