import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawCardMove,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedListCards } from '../GetBoardDetail/GetBoardDetail.ts'
import { deleteCachedCardDetail } from '../GetCardDetail/GetCardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const moveCard = async (
  fetchLike: FetchLike,
  card: DrawCard,
  move: DrawCardMove,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCard> => {
  const movedCard = await requestJson<DrawCard>(
    fetchLike,
    `/cards/${card.id}`,
    credentials,
    {
      fields: 'name,url,idBoard,idList,badges,cover',
      idList: move.idList,
      pos: move.pos,
    },
    {
      method: 'PUT',
    },
  )
  await Promise.all([
    deleteCachedCardDetail(cache, card, credentials),
    ...(card.idList
      ? [deleteCachedListCards(cache, card.idList, credentials)]
      : []),
    deleteCachedListCards(cache, move.idList, credentials),
  ])
  return movedCard
}
