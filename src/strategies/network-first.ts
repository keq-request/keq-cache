import { KeqContext, KeqNext, createResponseProxy } from 'keq'
import { StrategyOptions } from '~/types/strategies-options.js'
import { getResponseBytes } from '~/utils/get-response-bytes.js'

export async function networkFirst(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { key, storage } = opts

  try {
    await next()

    if (ctx.response) {
      storage.add({
        key: key,
        response: ctx.response,
        size: await getResponseBytes(ctx.response),
        createAt: new Date(),
        expiredAt: undefined,
        visitAt: new Date(),
        visitCount: 1,
      })
    }
  } catch (err) {
    const cache = await storage.get(key)
    if (!cache) throw err

    ctx.res = cache.response
    ctx.response = createResponseProxy(cache.response)
    ctx.metadata.entryNextTimes = 1
    ctx.metadata.outNextTimes = 1
  }
}
