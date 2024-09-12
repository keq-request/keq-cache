import dayjs from 'dayjs'
import { KeqContext, KeqNext } from 'keq'
import { BaseStorage } from '~/storage/base-storage'
import { getResponseBytes } from '~/utils/get-response-bytes'

export async function cacheFirst(ctx: KeqContext, next: KeqNext, storage: BaseStorage): Promise<void> {
  const identifier = ctx.identifier
  const cache = await storage.get(identifier)

  if (cache) {
    // hit cache
    ctx.res = cache.response
    return
  }

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
