import dayjs from 'dayjs'
import { KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options'
import { createResponseProxy } from '~/utils/create-response-proxy'
import { getResponseBytes } from '~/utils/get-response-bytes'


export async function staleWhileRevalidate(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { key, storage } = opts

  async function updateCache(): Promise<void> {
    await next()

    if (ctx.response) {
      storage.add({
        key: key,
        response: ctx.response,
        size: await getResponseBytes(ctx.response),
        createAt: dayjs().toISOString(),
        expiredAt: undefined,
        visitAt: dayjs().toISOString(),
        visitCount: 1,
      })
    }
  }

  const cache = await storage.get(key)
  if (cache) {
    // hit cache
    ctx.res = cache.response
    ctx.response = createResponseProxy(cache.response)
    ctx.metadata.entryNextTimes = 1
    ctx.metadata.outNextTimes = 1

    setTimeout(updateCache, 1)
  } else {
    await updateCache()
  }
}
