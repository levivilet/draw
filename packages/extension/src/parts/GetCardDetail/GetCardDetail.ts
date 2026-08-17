import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCard,
  DrawCardDetail,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import {
  deleteCachedJson,
  readCachedJson,
  requestJson,
  requestJsonBatch,
} from '../RequestJson/RequestJson.ts'

const cardParams = {
  fields: 'name,desc,url,idBoard,idList,labels',
} as const

const attachmentsParams = {
  fields: 'name,url,mimeType,previews',
} as const

const commentsParams = {
  fields: 'data,date,id',
  filter: 'commentCard',
  memberCreator: 'true',
  memberCreator_fields: 'avatarHash,avatarUrl,fullName,initials,username',
} as const

type DrawCardDetailBatchResult = readonly [
  DrawCard,
  DrawCardDetail['attachments'],
  DrawCardDetail['comments'],
]

const getBatchCard = async (
  result: Readonly<Promise<DrawCardDetailBatchResult>>,
): Promise<DrawCard> => {
  const values = await result
  return values[0]
}

const getBatchAttachments = async (
  result: Readonly<Promise<DrawCardDetailBatchResult>>,
): Promise<DrawCardDetail['attachments']> => {
  const values = await result
  return values[1]
}

const getBatchComments = async (
  result: Readonly<Promise<DrawCardDetailBatchResult>>,
): Promise<DrawCardDetail['comments']> => {
  const values = await result
  return values[2]
}

export const readCachedCardDetail = async (
  cache: DrawApiCache | undefined,
  card: DrawCard,
  credentials: DrawCredentials,
): Promise<DrawCardDetail | undefined> => {
  const [detailCard, attachments, comments] = await Promise.all([
    readCachedJson<DrawCard>(
      cache,
      `/cards/${card.id}`,
      credentials,
      cardParams,
    ),
    readCachedJson<DrawCardDetail['attachments']>(
      cache,
      `/cards/${card.id}/attachments`,
      credentials,
      attachmentsParams,
    ),
    readCachedJson<DrawCardDetail['comments']>(
      cache,
      `/cards/${card.id}/actions`,
      credentials,
      commentsParams,
    ),
  ])
  if (!detailCard || !attachments || !comments) {
    return undefined
  }
  return {
    attachments,
    card: detailCard,
    comments,
  }
}

export const deleteCachedCardDetail = async (
  cache: DrawApiCache | undefined,
  card: DrawCard,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(cache, `/cards/${card.id}`, credentials, cardParams)
}

export const deleteCachedCardComments = async (
  cache: DrawApiCache | undefined,
  card: DrawCard,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(
    cache,
    `/cards/${card.id}/actions`,
    credentials,
    commentsParams,
  )
}

export const deleteCachedCardAttachments = async (
  cache: DrawApiCache | undefined,
  card: DrawCard,
  credentials: DrawCredentials,
): Promise<void> => {
  await deleteCachedJson(
    cache,
    `/cards/${card.id}/attachments`,
    credentials,
    attachmentsParams,
  )
}

export const getCardDetailCard = (
  fetchLike: FetchLike,
  card: DrawCard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCard> => {
  return requestJson<DrawCard>(
    fetchLike,
    `/cards/${card.id}`,
    credentials,
    cardParams,
    undefined,
    cache,
  )
}

export const getCardDetailAttachments = (
  fetchLike: FetchLike,
  card: DrawCard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCardDetail['attachments']> => {
  return requestJson<DrawCardDetail['attachments']>(
    fetchLike,
    `/cards/${card.id}/attachments`,
    credentials,
    attachmentsParams,
    undefined,
    cache,
  )
}

export const getCardDetailComments = (
  fetchLike: FetchLike,
  card: DrawCard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawCardDetail['comments']> => {
  return requestJson<DrawCardDetail['comments']>(
    fetchLike,
    `/cards/${card.id}/actions`,
    credentials,
    commentsParams,
    undefined,
    cache,
  )
}

export const getCardDetail = async (
  fetchLike: FetchLike,
  card: DrawCard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
  batchRequestsEnabled = false,
): Promise<DrawCardDetail> => {
  const {
    attachments,
    card: detailCard,
    comments,
  } = getCardDetailParts(
    fetchLike,
    card,
    credentials,
    cache,
    batchRequestsEnabled,
  )
  const [resolvedCard, resolvedAttachments, resolvedComments] =
    await Promise.all([detailCard, attachments, comments])
  return {
    attachments: resolvedAttachments,
    card: resolvedCard,
    comments: resolvedComments,
  }
}

export const getCardDetailParts = (
  fetchLike: FetchLike,
  card: DrawCard,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
  batchRequestsEnabled = false,
): {
  readonly attachments: Promise<DrawCardDetail['attachments']>
  readonly card: Promise<DrawCard>
  readonly comments: Promise<DrawCardDetail['comments']>
} => {
  if (!batchRequestsEnabled) {
    const detailCard = getCardDetailCard(fetchLike, card, credentials, cache)
    const attachments = getCardDetailAttachments(
      fetchLike,
      card,
      credentials,
      cache,
    )
    const comments = getCardDetailComments(fetchLike, card, credentials, cache)
    return {
      attachments,
      card: detailCard,
      comments,
    }
  }
  const result = requestJsonBatch<DrawCardDetailBatchResult>(
    fetchLike,
    [
      {
        params: cardParams,
        path: `/cards/${card.id}`,
      },
      {
        params: attachmentsParams,
        path: `/cards/${card.id}/attachments`,
      },
      {
        params: commentsParams,
        path: `/cards/${card.id}/actions`,
      },
    ],
    credentials,
    cache,
  )
  return {
    attachments: getBatchAttachments(result),
    card: getBatchCard(result),
    comments: getBatchComments(result),
  }
}
