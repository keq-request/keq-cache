import { KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options.js'


export async function networkOnly(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  await next()

  if (ctx.response) {
    if (opts.onNetworkResponse) {
      opts.onNetworkResponse(ctx.response.clone())
    }
  }
}
