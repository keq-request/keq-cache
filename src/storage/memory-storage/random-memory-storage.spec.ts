import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction.enum'
import { appendExpiringItem } from '~~/__tests__/helpers'


test('new MemoryStorage({ size: 100, eviction: Eviction.RANDOM })', async () => {
  const storage = new MemoryStorage({
    size: 100,
    eviction: Eviction.RANDOM,
  })

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
})
