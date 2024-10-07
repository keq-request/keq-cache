/* eslint-disable @typescript-eslint/no-floating-promises */
import { expect, test } from '@jest/globals'
import { networkFirst } from './network-first'
import { MemoryStorage } from '~/storage'
import { Eviction } from '~/constants/eviction'
import { spyOn } from 'jest-mock'
import { createKeqNext, createKeqContext } from '~~/__tests__/helpers'


test('Strategies.NETWORK_FIRST', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.TTL)

  spyOn(storage, 'add')

  const ctx1 = createKeqContext()
  const next1 = createKeqNext(ctx1, '1')
  await networkFirst(ctx1, next1, {
    key: 'key1',
    storage,
  })
  expect(next1).toBeCalledTimes(1)

  const ctx2 = createKeqContext()
  const next2 = createKeqNext(ctx2, '2')
  await networkFirst(ctx2, next2, {
    key: 'key1',
    storage,
  })
  expect(next2).toBeCalledTimes(1)

  const ctx3 = createKeqContext()
  const next3 = createKeqNext(ctx3, new Error())
  await networkFirst(ctx3, next3, {
    key: 'key1',
    storage,
  })
  expect(next3).toBeCalledTimes(1)

  const ctx4 = createKeqContext()
  const next4 = createKeqNext(ctx4, new Error())

  expect(networkFirst(ctx4, next4, {
    key: 'key2',
    storage,
  })).rejects.toThrowError()

  expect(storage.add).toBeCalledTimes(2)

  expect(await ctx1.response?.text()).toEqual('1')
  expect(await ctx2.response?.text()).toEqual('2')
  expect(await ctx3.response?.text()).toEqual('2')
})
