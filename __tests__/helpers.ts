import * as R from 'ramda'
import dayjs from 'dayjs'
import { BaseStorage } from '~/storage/base-storage'
import { getResponseBytes } from '~/utils/get-response-bytes'


export async function appendExpiringItem(storage: BaseStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `temp_${i}`,
      createAt: new Date(),
      visitAt: dayjs()
        .add(i, 'minute')
        .toDate(),
      visitCount: 1 + i,
      response,
      size,
      expiredAt: dayjs()
        .add(i + 100, 'minute')
        .toDate(),
    })
  }
}

export async function appendPermanentItem(storage: BaseStorage, num: number): Promise<void> {
  for (const i of R.range(0, num)) {
    const response = new Response('hello world', { status: 200 })

    const size = await getResponseBytes(response.clone())
    await storage.evict(size)

    await storage.add({
      key: `per_${i}`,
      createAt: new Date(),
      visitAt: dayjs()
        .add(i, 'minute')
        .toDate(),
      visitCount: 1 + i,
      response,
      size,
    })
  }
}
