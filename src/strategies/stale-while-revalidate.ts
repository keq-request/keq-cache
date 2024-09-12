import dayjs from 'dayjs'
import { KeqContext, KeqNext } from 'keq'
import { BaseStorage } from '~/storage/base-storage'
import { getResponseBytes } from '~/utils/get-response-bytes'


export async function staleWhileRevalidate(ctx: KeqContext, next: KeqNext, storage: BaseStorage): Promise<void> {
  const identifier = ctx.identifier

  async function updateCache(): Promise<void> {
    await next()

    if (ctx.response) {
      storage.add(identifier, {
        key: identifier,
        response: ctx.response,
        size: await getResponseBytes(ctx.response),
        createAt: dayjs().toISOString(),
        expiredAt: undefined,
        visitAt: dayjs().toISOString(),
        visitCount: 1,
      })
    }
  }

  const cache = await storage.get(identifier)
  if (cache) {
    // hit cache
    ctx.res = cache.response
    void updateCache()
  } else {
    await updateCache()
  }
}
