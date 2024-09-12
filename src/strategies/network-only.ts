import { KeqContext, KeqNext } from 'keq'
import { BaseStorage } from '~/storage/base-storage'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function networkOnly(ctx: KeqContext, next: KeqNext, storage: BaseStorage): Promise<void> {
  await next()
}
