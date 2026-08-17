import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawCardCreate,
  DrawCredentials,
  DrawList,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedListCards } from '../GetBoardDetail/GetBoardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const createCard = async (
  fetchLike: FetchLike,
  list: DrawList,
  create: DrawCardCreate,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCard> => {
  const card = await requestJson<DrawCard>(
    fetchLike,
    '/cards',
    credentials,
    {
      fields: 'name,url,idBoard,idList,badges',
      idList: list.id,
      name: create.name,
      pos: create.pos,
    },
    {
      method: 'POST',
    },
  )
  await deleteCachedListCards(cache, list.id, credentials)
  return card
}
