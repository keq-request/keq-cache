import { createResponseProxy, KeqContext, KeqNext } from 'keq'
import { CacheEntry } from '~/cache-entry'
import { StrategyOptions } from '~/types/strategies-options.js'


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
          storage.set(await CacheEntry.build({
            key: key,
            response: value,
            ttl: opts.ttl,
          }))
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
        storage.set(await CacheEntry.build({
          key: key,
          response: ctx.response,
          ttl: opts.ttl,
        }))
      }

      if (opts.onNetworkResponse) {
        opts.onNetworkResponse(ctx.response.clone())
      }
    }
  }
}
