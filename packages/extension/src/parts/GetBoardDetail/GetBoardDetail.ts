import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawBoardDetail,
  DrawCredentials,
  DrawList,
  DrawCard,
} from '../DrawTypes/DrawTypes.ts'
import {
  deleteCachedJson,
  readCachedJson,
  requestJson,
  requestJsonBatch,
  type DrawBatchRequest,
} from '../RequestJson/RequestJson.ts'

const batchRequestLimit = 10

const listParams = {
  fields: 'name',
} as const

const cardsParams = {
  attachment_fields: 'name,url,mimeType,previews',
  attachments: 'cover',
  fields: 'name,desc,url,idBoard,idList,badges,cover,labels',
} as const

export const deleteCachedBoardLists = async (
  cache: DrawApiCache | undefined,
  boardId: string,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(
    cache,
    `/boards/${boardId}/lists`,
    credentials,
    listParams,
  )
}

export const deleteCachedListCards = async (
  cache: DrawApiCache | undefined,
  listId: string,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(
    cache,
    `/lists/${listId}/cards`,
    credentials,
    cardsParams,
  )
}

export const readCachedBoardDetail = async (
  cache: DrawApiCache | undefined,
  board: DrawBoard,
  credentials: DrawCredentials,
): Promise<DrawBoardDetail | undefined> => {
  const lists = await readCachedJson<readonly Omit<DrawList, 'cards'>[]>(
    cache,
    `/boards/${board.id}/lists`,
    credentials,
    listParams,
  )
  if (!lists) {
    return undefined
  }
  const cardsByList = await Promise.all(
    lists.map((list) => {
      return readCachedJson<readonly DrawCard[]>(
        cache,
        `/lists/${list.id}/cards`,
        credentials,
        cardsParams,
      )
    }),
  )
  if (cardsByList.some((cards) => !cards)) {
    return undefined
  }
  return {
    board,
    lists: lists.map((list, index) => {
      return {
        cards: cardsByList[index] || [],
        id: list.id,
        name: list.name,
      }
    }),
  }
}

export const getBoardDetail = async (
  fetchLike: FetchLike,
  board: DrawBoard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
  batchRequestsEnabled = false,
): Promise<DrawBoardDetail> => {
  const lists = await requestJson<readonly Omit<DrawList, 'cards'>[]>(
    fetchLike,
    `/boards/${board.id}/lists`,
    credentials,
    listParams,
    undefined,
    cache,
  )
  const cardsByList = batchRequestsEnabled
    ? await getCardsBatched(fetchLike, lists, credentials, cache)
    : await Promise.all(
      lists.map((list) => {
        return requestJson<readonly DrawCard[]>(
          fetchLike,
          `/lists/${list.id}/cards`,
          credentials,
          cardsParams,
          undefined,
          cache,
        )
      }),
    )
  return {
    board,
    lists: lists.map((list, index) => {
      return {
        cards: cardsByList[index] || [],
        id: list.id,
        name: list.name,
      }
    }),
  }
}

const getCardsBatched = async (
  fetchLike: FetchLike,
  lists: readonly Omit<DrawList, 'cards'>[],
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<readonly (readonly DrawCard[])[]> => {
  const requests: DrawBatchRequest[] = lists.map((list) => {
    return {
      params: cardsParams,
      path: `/lists/${list.id}/cards`,
    }
  })
  const batches: DrawBatchRequest[][] = []
  for (let index = 0; index < requests.length; index += batchRequestLimit) {
    batches.push(requests.slice(index, index + batchRequestLimit))
  }
  const results = await Promise.all(
    batches.map((batch: readonly DrawBatchRequest[]) => {
      return requestJsonBatch<readonly (readonly DrawCard[])[]>(
        fetchLike,
        batch,
        credentials,
        cache,
      )
    }),
  )
  return results.flat()
}
