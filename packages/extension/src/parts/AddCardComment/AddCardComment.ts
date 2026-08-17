import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawComment,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedCardComments } from '../GetCardDetail/GetCardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const addCardComment = async (
  fetchLike: FetchLike,
  card: DrawCard,
  text: string,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawComment> => {
  const comment = await requestJson<DrawComment>(
    fetchLike,
    `/cards/${card.id}/actions/comments`,
    credentials,
    {
      text,
    },
    {
      method: 'POST',
    },
  )
  await deleteCachedCardComments(cache, card, credentials)
  return comment
}
