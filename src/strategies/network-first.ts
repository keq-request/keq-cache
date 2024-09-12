import dayjs from 'dayjs'
import { KeqContext, KeqNext } from 'keq'
import { BaseStorage } from '~/storage/base-storage'
import { getResponseBytes } from '~/utils/get-response-bytes'

export async function networkFirst(ctx: KeqContext, next: KeqNext, storage: BaseStorage): Promise<void> {
  const identifier = ctx.identifier

  try {
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
  } catch (err) {
    const cache = await storage.get(identifier)
    if (!cache) throw err

    ctx.res = cache.response
  }
}
