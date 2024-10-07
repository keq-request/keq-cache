import { expect, test } from '@jest/globals'
import { cache, Storage, Strategy } from './index'


test('cache()', async () => {
  expect(cache()).toBeInstanceOf(Function)
  expect(cache({
    storage: Storage.MEMORY,
    maxStorageSize: 2 * 1000 * 1000,
    threshold: 0.2 * 2 * 1000 * 1000,

    keyFactory: (ctx) => ctx.request.__url__.href,
    rules: [{
      pattern: /\/cat/,
      strategy: Strategy.CATCH_FIRST,
      ttl: 1000,
    }],
  }))
})
