import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawCredentials,
  DrawLabel,
  DrawLabelCreate,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedBoardLabels } from '../ListBoardLabels/ListBoardLabels.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const createLabel = async (
  fetchLike: FetchLike,
  board: DrawBoard,
  create: DrawLabelCreate,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawLabel> => {
  const label = await requestJson<DrawLabel>(
    fetchLike,
    '/labels',
    credentials,
    {
      color: create.color,
      idBoard: board.id,
      name: create.name,
    },
    {
      method: 'POST',
    },
  )
  await deleteCachedBoardLabels(cache, board.id, credentials)
  return label
}
