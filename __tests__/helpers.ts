import * as R from 'ramda'
import dayjs from 'dayjs'
import { BaseStorage } from '~/storage/base-storage'
import { getResponseBytes } from '~/utils/get-response-bytes'
import { createResponseProxy, KeqContext, KeqNext } from 'keq'
import { Mock } from 'jest-mock'
import { jest } from '@jest/globals'


export async function appendExpiringItem(storage: BaseStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200, headers: new Headers({ 'content-length': '11' }) })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `temp_${i}`,
      createAt: new Date(),
      visitAt: dayjs()
        .add(i, 'minute')
        .toDate(),
      visitCount: 1 + i,
      response,
      size,
      expiredAt: dayjs()
        .add(i + 100, 'minute')
        .toDate(),
    })
  }
}

export async function appendPermanentItem(storage: BaseStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `per_${i}`,
      createAt: new Date(),
      visitAt: dayjs()
        .add(i, 'minute')
        .toDate(),
      visitCount: 1 + i,
      response,
      size,
    })
  }
}

export function createKeqContext(): KeqContext {
  return {
    metadata: {
      finished: false,
      entryNextTimes: 0,
      outNextTimes: 0,
    },
    request: {
      url: new URL('http://example.com'),
      method: 'get',
      headers: new Headers({
        'x-insert1': 'exists1',
      }),
      routeParams: {},
      body: {},
    },
    options: {},
    global: {},
  } as unknown as KeqContext
}

export function createKeqNext(context: KeqContext, body: string | Error = 'Hello world'): Mock<KeqNext> {
  const next = jest.fn(async () => {
    if (body instanceof Error) {
      throw body
    }

    const response = new Response(body)

    context.res = response
    context.response = createResponseProxy(response)
  })

  return next
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
