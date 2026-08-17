import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawCredentials,
  DrawLabel,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedCardDetail } from '../GetCardDetail/GetCardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const addCardLabel = async (
  fetchLike: FetchLike,
  card: DrawCard,
  label: DrawLabel,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCard> => {
  const updatedCard = await requestJson<DrawCard>(
    fetchLike,
    `/cards/${card.id}/idLabels`,
    credentials,
    {
      value: label.id,
    },
    {
      method: 'POST',
    },
  )
  await deleteCachedCardDetail(cache, card, credentials)
  return updatedCard
}
