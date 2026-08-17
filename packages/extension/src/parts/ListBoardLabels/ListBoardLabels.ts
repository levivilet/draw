import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawCredentials,
  DrawLabel,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedJson, requestJson } from '../RequestJson/RequestJson.ts'

export const labelParams = {
  fields: 'name,color,idBoard',
  limit: '1000',
} as const

export const deleteCachedBoardLabels = async (
  cache: DrawApiCache | undefined,
  boardId: string,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(
    cache,
    `/boards/${boardId}/labels`,
    credentials,
    labelParams,
  )
}

export const listBoardLabels = (
  fetchLike: FetchLike,
  board: DrawBoard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<readonly DrawLabel[]> => {
  return requestJson<readonly DrawLabel[]>(
    fetchLike,
    `/boards/${board.id}/labels`,
    credentials,
    labelParams,
    undefined,
    cache,
  )
}
