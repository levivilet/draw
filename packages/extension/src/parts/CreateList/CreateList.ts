import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawCredentials,
  DrawList,
  DrawListCreate,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedBoardLists } from '../GetBoardDetail/GetBoardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const createList = async (
  fetchLike: FetchLike,
  board: DrawBoard,
  create: DrawListCreate,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawList> => {
  const list = await requestJson<Omit<DrawList, 'cards'>>(
    fetchLike,
    '/lists',
    credentials,
    {
      fields: 'name',
      idBoard: board.id,
      name: create.name,
      pos: create.pos,
    },
    {
      method: 'POST',
    },
  )
  await deleteCachedBoardLists(cache, board.id, credentials)
  return {
    ...list,
    cards: [],
  }
}
