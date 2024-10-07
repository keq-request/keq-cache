import { expect, test } from '@jest/globals'
import { Mock } from 'jest-mock'
import { createRequest } from 'keq'
import { cache } from './cache'
import { Strategy } from './constants/strategy'
import { MemoryStorage } from './storage'


test('Strategies.NETWORK_ONLY', async () => {
  const mockedFetch = global.fetch as Mock<typeof global.fetch>
  const request = createRequest()

  request.use(cache())

  const body1 = await request
    .get('/cat')

  expect(body1.code).toBe('200')

  const body2 = await request
    .get('/cat')

  expect(body2.code).toBe('200')

  expect(mockedFetch).toBeCalledTimes(2)
})

test('Strategies.CATCH_FIRST', async () => {
  const mockedFetch = global.fetch as Mock<typeof global.fetch>
  const request = createRequest()

  request.use(cache({
    keyFactory: (ctx) => ctx.request.__url__.href,
    rules: [{
      pattern: /\/cat/,
      strategy: Strategy.CATCH_FIRST,
    }],
  }))

  const body1 = await request
    .get('/cat')
  expect(body1.code).toBe('200')

  const body2 = await request
    .get('/cat')
  expect(body2.code).toBe('200')

  const body3 = await request
    .get('/dog')
  expect(body3.code).toBe('200')

  expect(mockedFetch).toBeCalledTimes(2)
})

test('Strategies.NETWORK_FIRST', async () => {
  const mockedFetch = global.fetch as Mock<typeof global.fetch>
  const request = createRequest()


  request.use(cache({
    keyFactory: (ctx) => ctx.request.__url__.href,
    storage: MemoryStorage,
    rules: [{
      pattern: /\/cat/,
      strategy: Strategy.NETWORK_FIRST,
    }],
  }))

  const body1 = await request
    .get('/cat')
  expect(body1.code).toBe('200')

  const body2 = await request
    .get('/cat')
  expect(body2.code).toBe('200')

  expect(mockedFetch).toBeCalledTimes(2)
})
