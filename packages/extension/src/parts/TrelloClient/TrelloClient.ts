import type {
  FetchLike,
  DrawCacheFirstResult,
  DrawClient,
  DrawClientOptions,
} from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawBoardDetail,
  DrawCard,
  DrawCardDetail,
  DrawComment,
  DrawCredentials,
  DrawLabel,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'
import { addCardAttachment } from '../AddCardAttachment/AddCardAttachment.ts'
import { addCardComment } from '../AddCardComment/AddCardComment.ts'
import { addCardLabel } from '../AddCardLabel/AddCardLabel.ts'
import { createCard } from '../CreateCard/CreateCard.ts'
import { createLabel } from '../CreateLabel/CreateLabel.ts'
import { createList } from '../CreateList/CreateList.ts'
import {
  getBoardDetail,
  readCachedBoardDetail,
} from '../GetBoardDetail/GetBoardDetail.ts'
import {
  getCardDetail,
  getCardDetailParts,
  readCachedCardDetail,
} from '../GetCardDetail/GetCardDetail.ts'
import { listBoardLabels } from '../ListBoardLabels/ListBoardLabels.ts'
import { listBoards, readCachedListBoards } from '../ListBoards/ListBoards.ts'
import { moveCard } from '../MoveCard/MoveCard.ts'
import { readCachedSearch, search } from '../Search/Search.ts'
import {
  createCacheStorageDrawApiCache,
  type DrawApiCache,
} from '../DrawApiCache/DrawApiCache.ts'
import { updateCard } from '../UpdateCard/UpdateCard.ts'
import { updateList } from '../UpdateList/UpdateList.ts'

export type {
  FetchLike,
  DrawClient,
} from '../DrawClientTypes/DrawClientTypes.ts'

export const createDrawClient = (
  fetchLike: FetchLike = fetch,
  cache: DrawApiCache | undefined = createCacheStorageDrawApiCache(),
  options: DrawClientOptions = {},
): DrawClient => {
  const readBatchRequestsEnabled =
    options.readBatchRequestsEnabled ||
    ((): Promise<boolean> => Promise.resolve(false))
  const getFreshBoardDetail = async (
    board: DrawBoard,
    credentials: DrawCredentials,
  ): Promise<DrawBoardDetail> => {
    return getBoardDetail(
      fetchLike,
      board,
      credentials,
      cache,
      await readBatchRequestsEnabled(),
    )
  }
  const getFreshCardDetail = async (
    card: DrawCard,
    credentials: DrawCredentials,
  ): Promise<DrawCardDetail> => {
    return getCardDetail(
      fetchLike,
      card,
      credentials,
      cache,
      await readBatchRequestsEnabled(),
    )
  }
  return {
    addCardAttachment(
      card,
      file,
      credentials,
    ): ReturnType<DrawClient['addCardAttachment']> {
      return addCardAttachment(fetchLike, card, file, credentials, cache)
    },
    addCardComment(
      card: DrawCard,
      text: string,
      credentials: DrawCredentials,
    ): Promise<DrawComment> {
      return addCardComment(fetchLike, card, text, credentials, cache)
    },
    addCardLabel(
      card: DrawCard,
      label: DrawLabel,
      credentials: DrawCredentials,
    ): ReturnType<DrawClient['addCardLabel']> {
      return addCardLabel(fetchLike, card, label, credentials, cache)
    },
    createCard(
      list,
      create,
      credentials,
    ): ReturnType<DrawClient['createCard']> {
      return createCard(fetchLike, list, create, credentials, cache)
    },
    createLabel(
      board: DrawBoard,
      create,
      credentials,
    ): ReturnType<DrawClient['createLabel']> {
      return createLabel(fetchLike, board, create, credentials, cache)
    },
    createList(
      board: DrawBoard,
      create,
      credentials,
    ): ReturnType<DrawClient['createList']> {
      return createList(fetchLike, board, create, credentials, cache)
    },
    async getBoardDetail(
      board,
      credentials,
    ): ReturnType<DrawClient['getBoardDetail']> {
      return getFreshBoardDetail(board, credentials)
    },
    async getBoardDetailCacheFirst(
      board: DrawBoard,
      credentials: DrawCredentials,
    ): Promise<DrawCacheFirstResult<DrawBoardDetail>> {
      return {
        cached: await readCachedBoardDetail(cache, board, credentials),
        fresh: getFreshBoardDetail(board, credentials),
      }
    },
    async getCardDetail(
      card,
      credentials,
    ): ReturnType<DrawClient['getCardDetail']> {
      return getFreshCardDetail(card, credentials)
    },
    async getCardDetailCacheFirst(
      card: DrawCard,
      credentials: DrawCredentials,
    ): Promise<DrawCacheFirstResult<DrawCardDetail>> {
      return {
        cached: await readCachedCardDetail(cache, card, credentials),
        fresh: getFreshCardDetail(card, credentials),
      }
    },
    async getCardDetailPartsCacheFirst(
      card: DrawCard,
      credentials: DrawCredentials,
    ): ReturnType<DrawClient['getCardDetailPartsCacheFirst']> {
      const [cached, batchRequestsEnabled] = await Promise.all([
        readCachedCardDetail(cache, card, credentials),
        readBatchRequestsEnabled(),
      ])
      return {
        cached,
        fresh: getCardDetailParts(
          fetchLike,
          card,
          credentials,
          cache,
          batchRequestsEnabled,
        ),
      }
    },
    listBoardLabels(
      board,
      credentials,
    ): ReturnType<DrawClient['listBoardLabels']> {
      return listBoardLabels(fetchLike, board, credentials, cache)
    },
    listBoards(credentials): ReturnType<DrawClient['listBoards']> {
      return listBoards(fetchLike, credentials, cache)
    },
    async listBoardsCacheFirst(
      credentials,
    ): ReturnType<DrawClient['listBoardsCacheFirst']> {
      return {
        cached: await readCachedListBoards(cache, credentials),
        fresh: listBoards(fetchLike, credentials, cache),
      }
    },
    moveCard(card, move, credentials): ReturnType<DrawClient['moveCard']> {
      return moveCard(fetchLike, card, move, credentials, cache)
    },
    search(query, credentials): ReturnType<DrawClient['search']> {
      return search(fetchLike, query, credentials, cache)
    },
    async searchCacheFirst(
      query: string,
      credentials: DrawCredentials,
    ): Promise<DrawCacheFirstResult<readonly DrawSearchResult[]>> {
      return {
        cached: await readCachedSearch(cache, query, credentials),
        fresh: search(fetchLike, query, credentials, cache),
      }
    },
    updateCard(
      card,
      update,
      credentials,
    ): ReturnType<DrawClient['updateCard']> {
      return updateCard(fetchLike, card, update, credentials, cache)
    },
    updateList(
      list,
      update,
      credentials,
    ): ReturnType<DrawClient['updateList']> {
      return updateList(fetchLike, list, update, credentials)
    },
  }
}
