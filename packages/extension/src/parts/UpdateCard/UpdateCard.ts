import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawCardUpdate,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedCardDetail } from '../GetCardDetail/GetCardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const updateCard = async (
  fetchLike: FetchLike,
  card: DrawCard,
  update: DrawCardUpdate,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCard> => {
  const updatedCard = await requestJson<DrawCard>(
    fetchLike,
    `/cards/${card.id}`,
    credentials,
    {
      desc: update.desc,
      fields: 'name,desc,url,idBoard,idList,badges,cover',
      name: update.name,
    },
    {
      method: 'PUT',
    },
  )
  await deleteCachedCardDetail(cache, card, credentials)
  return updatedCard
}
