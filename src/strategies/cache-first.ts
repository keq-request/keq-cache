import dayjs from 'dayjs'
import { KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options'
import { createResponseProxy } from '~/utils/create-response-proxy'
import { getResponseBytes } from '~/utils/get-response-bytes'

export async function cacheFirst(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { storage, key } = opts

  const cache = await storage.get(key)

  if (cache) {
    // hit cache
    ctx.res = cache.response
    ctx.response = createResponseProxy(cache.response)
    ctx.metadata.entryNextTimes = 1
    ctx.metadata.outNextTimes = 1

    return
  }

  await next()

  if (ctx.response) {
    const size = await getResponseBytes(ctx.response)
    storage.add({
      key: key,
      response: ctx.response,
      size,
      createAt: dayjs().toISOString(),
      expiredAt: undefined,
      visitAt: dayjs().toISOString(),
      visitCount: 1,
    })
  }
}
