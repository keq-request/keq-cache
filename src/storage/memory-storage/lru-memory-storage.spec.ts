import { expect, test } from '@jest/globals'
import { MemoryStorage } from './memory-storage'
import { Eviction } from '~/constants/eviction.enum'
import { appendExpiringItem } from '~~/__tests__/helpers'

test('new MemoryStorage({ size: 100, eviction: Eviction.LRU })', async () => {
  const storage = new MemoryStorage({ size: 100, eviction: Eviction.LRU })

  await appendExpiringItem(storage, 10)

  expect(await storage.length()).toBe(9)
  const temp_0 = await storage.get('temp_0')
  expect(temp_0).toBeUndefined()
})
