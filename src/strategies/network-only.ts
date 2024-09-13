import { KeqContext, KeqNext } from 'keq'
import { StrategyOptions } from '~/types/strategies-options'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function networkOnly(ctx: KeqContext, next: KeqNext, opts: StrategyOptions): Promise<void> {
  await next()
}
