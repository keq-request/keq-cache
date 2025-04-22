import { KeqContext, KeqNext, createResponseProxy } from 'keq'
import { StrategyOptions } from '~/types/strategies-options.js'
import { getResponseBytes } from '~/utils/get-response-bytes.js'

export async function cacheFirst(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { storage, key } = opts

  const cache = await storage.get(key)
  let cacheResponseProxy: Response | undefined

  if (cache) {
    // hit cache
    cacheResponseProxy = createResponseProxy(cache?.response)

    ctx.res = cache.response
    ctx.response = cacheResponseProxy
    ctx.metadata.entryNextTimes = 1
    ctx.metadata.outNextTimes = 1

    return
  }

  await next()

  if (ctx.response) {
    const size = await getResponseBytes(ctx.response)

    if (!opts.exclude || !(await opts.exclude(ctx.response))) {
      storage.add({
        key: key,
        response: ctx.response,
        size,
        createAt: new Date(),
        expiredAt: undefined,
        visitAt: new Date(),
        visitCount: 1,
      })
    }

    if (opts.onNetworkResponse) {
      opts.onNetworkResponse(ctx.response.clone(), cacheResponseProxy?.clone())
    }
  }
}
