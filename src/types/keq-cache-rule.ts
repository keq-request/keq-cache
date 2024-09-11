import { KeqContext } from 'keq'
import { KeqCacheOption } from './keq-cache-option'


export interface KeqCacheRule extends KeqCacheOption {
  pattern: RegExp | ((ctx: KeqContext) => boolean)
}
