/* eslint-disable @typescript-eslint/no-floating-promises */
import { expect, test } from '@jest/globals'
import { MemoryStorage } from '~/storage'
import { Eviction } from '~/constants/eviction'
import { spyOn } from 'jest-mock'
import { createKeqNext, createKeqContext, sleep } from '~~/__tests__/helpers'
import { staleWhileRevalidate } from './stale-while-revalidate'


test('Strategies.StaleWhileRevalidate', async () => {
  const storage = new MemoryStorage(100, 20, Eviction.TTL)

  spyOn(storage, 'add')

  const ctx1 = createKeqContext()
  const next1 = createKeqNext(ctx1, '1')
  await staleWhileRevalidate(ctx1, next1, {
    key: 'key1',
    storage,
  })
  expect(next1).toBeCalledTimes(1)
  expect(await ctx1.response?.text()).toEqual('1')

  const ctx2 = createKeqContext()
  const next2 = createKeqNext(ctx2, '2')
  await staleWhileRevalidate(ctx2, next2, {
    key: 'key1',
    storage,
  })

  expect(await ctx2.response?.text()).toEqual('1')
  // sleep 10ms
  await sleep(5)
  expect(next2).toBeCalledTimes(1)
  expect(await ctx2.response?.text()).toEqual('1')

  const ctx3 = createKeqContext()
  const next3 = createKeqNext(ctx3, new Error('hello world'))
  await staleWhileRevalidate(ctx3, next3, {
    key: 'key1',
    storage,
  })

  await sleep(5)
  expect(next3).toBeCalledTimes(1)
  expect(await ctx3.response?.text()).toEqual('2')

  const ctx4 = createKeqContext()
  const next4 = createKeqNext(ctx4, new Error())
  expect(staleWhileRevalidate(ctx4, next4, {
    key: 'key2',
    storage,
  })).rejects.toThrowError()

  expect(storage.add).toBeCalledTimes(2)
})
