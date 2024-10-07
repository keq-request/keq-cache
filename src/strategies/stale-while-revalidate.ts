import { createResponseProxy, KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options'
import { getResponseBytes } from '~/utils/get-response-bytes'


export async function staleWhileRevalidate(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { key, storage } = opts

  const cache = await storage.get(key)
  if (cache) {
    Object.defineProperty(ctx, 'res', {
      get() {
        return cache.response
      },
      async set(value) {
        storage.add({
          key: key,
          response: value,
          size: await getResponseBytes(value),
          createAt: new Date(),
          expiredAt: undefined,
          visitAt: new Date(),
          visitCount: 1,
        })
      },
    })

    Object.defineProperty(ctx, 'response', {
      get() {
        return createResponseProxy(cache.response)
      },
      set() {
        // ignore
      },
    })

    // hit cache
    ctx.metadata.entryNextTimes = 1
    ctx.metadata.outNextTimes = 1

    setTimeout(async () => {
      try {
        await next()
      } catch (err) {
        // ignore
      }
    }, 1)
  } else {
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
  }
}
