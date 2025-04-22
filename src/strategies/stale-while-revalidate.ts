import { createResponseProxy, KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options.js'
import { getResponseBytes } from '~/utils/get-response-bytes.js'


export async function staleWhileRevalidate(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  const { key, storage } = opts

  const cache = await storage.get(key)
  if (cache) {
    const cacheResponseProxy = createResponseProxy(cache.response)
    Object.defineProperty(ctx, 'res', {
      get() {
        return cache.response
      },
      async set(value) {
        if (!opts.exclude || !(await opts.exclude(value))) {
          storage.add({
            key: key,
            response: value,
            size: await getResponseBytes(value),
            createAt: new Date(),
            expiredAt: undefined,
            visitAt: new Date(),
            visitCount: 1,
          })
        }

        if (opts.onNetworkResponse) {
          opts.onNetworkResponse(value.clone(), cacheResponseProxy.clone())
        }
      },
    })

    Object.defineProperty(ctx, 'response', {
      get() {
        return cacheResponseProxy
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
        ctx.metadata.finished = false
        await next()
      } catch (err) {
        // ignore
      }
    }, 1)
  } else {
    await next()

    if (ctx.response) {
      if (!opts.exclude || !(await opts.exclude(ctx.response))) {
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

      if (opts.onNetworkResponse) {
        opts.onNetworkResponse(ctx.response.clone())
      }
    }
  }
}
