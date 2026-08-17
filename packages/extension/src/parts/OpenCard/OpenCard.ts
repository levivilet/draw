import type {
  DrawAttachment,
  DrawCard,
  DrawCardDetail,
  DrawComment,
} from '../DrawTypes/DrawTypes.ts'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import {
  getAttachmentImageUrl,
  isImageAttachment,
} from '../AttachmentHelpers/AttachmentHelpers.ts'
import {
  applyCardDetail,
  isSameJson,
} from '../CacheFirstHelpers/CacheFirstHelpers.ts'
import { findBoardCard } from '../FindBoardCard/FindBoardCard.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const isCurrentCardLoad = (
  state: Readonly<DrawViewState>,
  cardId: string,
): boolean => {
  return state.cardDetailLoadingCardId === cardId
}

const getCurrentDetailForCard = (
  state: Readonly<DrawViewState>,
  cardId: string,
): DrawCardDetail | undefined => {
  const { selectedCardDetail } = state
  if (selectedCardDetail?.card.id === cardId) {
    return selectedCardDetail
  }
  return undefined
}

const isCardAlreadyOpen = (
  state: Readonly<DrawViewState>,
  cardId: string,
): boolean => {
  return (
    state.selectedCardDetail?.card.id === cardId ||
    (state.cardDetailLoading && state.cardDetailLoadingCardId === cardId)
  )
}

const applyFreshCard = (
  state: Readonly<DrawViewState>,
  freshCard: Readonly<DrawCard>,
): void => {
  const mutableState = state as DrawViewState
  const current = getCurrentDetailForCard(state, freshCard.id)
  if (!current) {
    applyCardDetail(mutableState, {
      attachments: [],
      card: freshCard,
      comments: [],
    })
    return
  }
  mutableState.selectedCardDetail = {
    ...current,
    card: freshCard,
  }
  if (!state.editingCardTitle) {
    mutableState.draftCardTitle = freshCard.name
  }
  if (!state.editingCardDescription) {
    mutableState.draftCardDescription = freshCard.desc || ''
  }
}

const applyFreshComments = (
  state: Readonly<DrawViewState>,
  cardId: string,
  comments: readonly DrawComment[],
): void => {
  const mutableState = state as DrawViewState
  const current = getCurrentDetailForCard(state, cardId)
  if (!current) {
    return
  }
  mutableState.selectedCardDetail = {
    ...current,
    comments,
  }
}

const applyFreshAttachments = (
  state: Readonly<DrawViewState>,
  cardId: string,
  attachments: readonly DrawAttachment[],
): void => {
  const mutableState = state as DrawViewState
  const current = getCurrentDetailForCard(state, cardId)
  if (!current) {
    return
  }
  mutableState.selectedCardDetail = {
    ...current,
    attachments,
  }
}

export const resolveCardAttachmentImages = async (
  context: DrawViewActionContext,
  cardId: string,
  attachments: readonly DrawAttachment[],
): Promise<void> => {
  const state = context.state as DrawViewState
  const { credentials } = state
  if (!credentials) {
    return
  }
  const sourceUrls = attachments
    .filter(isImageAttachment)
    .map(getAttachmentImageUrl)
    .filter(Boolean)
  const resolvedUrls = await Promise.all(
    sourceUrls.map(async (sourceUrl) => {
      try {
        const imageUrl = await context.imageCache.resolveImageUrl(
          sourceUrl,
          credentials,
        )
        return [sourceUrl, imageUrl] as const
      } catch {
        return [sourceUrl, ''] as const
      }
    }),
  )
  if (
    !isCurrentCardLoad(state, cardId) ||
    state.credentials?.apiKey !== credentials.apiKey ||
    state.credentials?.token !== credentials.token
  ) {
    return
  }
  const attachmentImageUrls = { ...state.attachmentImageUrls }
  for (const [sourceUrl, imageUrl] of resolvedUrls) {
    if (imageUrl) {
      attachmentImageUrls[sourceUrl] = imageUrl
    }
  }
  state.attachmentImageUrls = attachmentImageUrls
  context.requestRerender()
}

const loadCardComments = async (
  context: DrawViewActionContext,
  cardId: string,
  commentsPromise: Readonly<Promise<readonly DrawComment[]>>,
  cardPromise: Readonly<Promise<Readonly<DrawCard>>>,
): Promise<void> => {
  const state = context.state as DrawViewState
  try {
    const comments = await commentsPromise
    if (!getCurrentDetailForCard(state, cardId)) {
      await cardPromise
      await Promise.resolve()
    }
    if (isCurrentCardLoad(state, cardId)) {
      applyFreshComments(state, cardId, comments)
    }
  } catch (error) {
    if (isCurrentCardLoad(state, cardId)) {
      state.error = getErrorMessage(error)
    }
  } finally {
    if (isCurrentCardLoad(state, cardId)) {
      state.cardCommentsLoading = false
      context.requestRerender()
    }
  }
}

const loadCardAttachments = async (
  context: DrawViewActionContext,
  cardId: string,
  attachmentsPromise: Readonly<Promise<readonly DrawAttachment[]>>,
  cardPromise: Readonly<Promise<Readonly<DrawCard>>>,
): Promise<void> => {
  const state = context.state as DrawViewState
  try {
    const attachments = await attachmentsPromise
    if (!getCurrentDetailForCard(state, cardId)) {
      await cardPromise
      await Promise.resolve()
    }
    if (isCurrentCardLoad(state, cardId)) {
      applyFreshAttachments(state, cardId, attachments)
      await resolveCardAttachmentImages(context, cardId, attachments)
    }
  } catch (error) {
    if (isCurrentCardLoad(state, cardId)) {
      state.error = getErrorMessage(error)
    }
  } finally {
    if (isCurrentCardLoad(state, cardId)) {
      state.cardAttachmentsLoading = false
      context.requestRerender()
    }
  }
}

export const openCard = async (
  context: DrawViewActionContext,
  cardId: string,
): Promise<void> => {
  const { client, requestRerender } = context
  const state = context.state as DrawViewState
  if (!state.credentials || !state.boardDetail) {
    return
  }
  if (isCardAlreadyOpen(state, cardId)) {
    return
  }
  const card = findBoardCard(state, cardId)
  if (!card) {
    state.error = DrawStrings.cardNotFound(cardId)
    requestRerender()
    return
  }
  state.cardDetailLoading = true
  state.cardDetailLoadingCardId = card.id
  state.cardAttachmentDropActive = false
  state.cardCommentsLoading = true
  state.cardAttachmentsLoading = true
  state.cardAttachmentsUploading = false
  state.attachmentImageUrls = {}
  state.selectedCardDetail = undefined
  state.addingCardLabelId = ''
  state.cardLabelCreateOpen = false
  state.cardLabelPickerOpen = false
  state.draftComment = ''
  state.draftLabelSearchQuery = ''
  state.draftNewLabelColor = 'green'
  state.draftNewLabelName = ''
  state.savingComment = false
  state.savingNewLabel = false
  state.writingComment = false
  state.error = ''
  state.failedCardAttachmentImageIds = []
  requestRerender()
  try {
    const result = await client.getCardDetailPartsCacheFirst(
      card,
      state.credentials,
    )
    if (result.cached) {
      applyCardDetail(state, result.cached)
      void resolveCardAttachmentImages(
        context,
        card.id,
        result.cached.attachments,
      )
      state.cardDetailLoading = false
      requestRerender()
    }
    const freshCardPromise = result.fresh.card
    const commentsPromise = loadCardComments(
      context,
      card.id,
      result.fresh.comments,
      freshCardPromise,
    )
    const attachmentsPromise = loadCardAttachments(
      context,
      card.id,
      result.fresh.attachments,
      freshCardPromise,
    )
    const freshCard = await freshCardPromise
    const selectedCardDetail = state.selectedCardDetail as
      | DrawCardDetail
      | undefined
    if (
      isCurrentCardLoad(state, card.id) &&
      (state.cardDetailLoading || selectedCardDetail?.card.id === card.id)
    ) {
      if (!isSameJson(selectedCardDetail?.card, freshCard)) {
        applyFreshCard(state, freshCard)
      }
      state.cardDetailLoading = false
      requestRerender()
    }
    await Promise.all([commentsPromise, attachmentsPromise])
  } catch (error) {
    if (isCurrentCardLoad(state, card.id)) {
      state.error = getErrorMessage(error)
      state.cardAttachmentsLoading = false
      state.cardCommentsLoading = false
      state.cardDetailLoading = false
      requestRerender()
    }
  }
}
