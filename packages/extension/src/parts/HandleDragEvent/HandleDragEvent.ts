import type { ViewEvent } from '@lvce-editor/api'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { findBoardCard } from '../FindBoardCard/FindBoardCard.ts'
import { moveCardToList } from '../MoveCardToList/MoveCardToList.ts'
import { uploadCardAttachments } from '../UploadCardAttachments/UploadCardAttachments.ts'

const cardPrefix = 'card:'
const cardDetailName = 'cardDetail'
const listPrefix = 'list:'

const getEventString = (event: Readonly<ViewEvent>, key: string): string => {
  const value = (event as unknown as Readonly<Record<string, unknown>>)[key]
  return typeof value === 'string' ? value : ''
}

const getCardIdFromName = (name: string | undefined): string => {
  if (!name?.startsWith(cardPrefix)) {
    return ''
  }
  return name.slice(cardPrefix.length)
}

const getListIdFromName = (name: string | undefined): string => {
  if (!name?.startsWith(listPrefix)) {
    return ''
  }
  return name.slice(listPrefix.length)
}

const getDroppedCardId = (
  state: Readonly<DrawViewState>,
  event: Readonly<ViewEvent>,
): string => {
  const value = getEventString(event, 'value')
  if (value) {
    return value
  }
  const data = getEventString(event, 'data')
  if (data) {
    return data
  }
  const text = getEventString(event, 'text')
  if (text) {
    return text
  }
  return state.draggedCardId
}

const clearDragState = (state: Readonly<DrawViewState>): void => {
  const mutableState = state as DrawViewState
  mutableState.draggedCardId = ''
  mutableState.dragTargetListId = ''
}

export const handleDragStartEvent = (
  context: DrawViewActionContext,
  event: Readonly<ViewEvent>,
): void => {
  const state = context.state as DrawViewState
  const cardId = getCardIdFromName(event.name)
  state.draggedCardId = cardId
  state.dragTargetListId = ''
}

export const handleDragOverEvent = (
  context: DrawViewActionContext,
  event: Readonly<ViewEvent>,
): void => {
  const state = context.state as DrawViewState
  if (event.name === cardDetailName && !state.draggedCardId) {
    if (state.cardAttachmentDropActive) {
      return
    }
    state.cardAttachmentDropActive = true
    context.requestRerender()
    return
  }
  const listId = getListIdFromName(event.name)
  if (state.dragTargetListId === listId) {
    return
  }
  state.dragTargetListId = listId
  context.requestRerender()
}

export const handleDragLeaveEvent = (
  context: DrawViewActionContext,
): void => {
  const state = context.state as DrawViewState
  if (state.cardAttachmentDropActive) {
    state.cardAttachmentDropActive = false
    context.requestRerender()
    return
  }
  if (!state.dragTargetListId) {
    return
  }
  state.dragTargetListId = ''
  context.requestRerender()
}

export const handleDragEndEvent = (context: DrawViewActionContext): void => {
  clearDragState(context.state)
  context.requestRerender()
}

export const handleDropEvent = async (
  context: DrawViewActionContext,
  event: Readonly<ViewEvent>,
  fileList?: FileList,
): Promise<void> => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  if (event.name === cardDetailName && !state.draggedCardId) {
    await uploadCardAttachments(context, fileList)
    return
  }
  const targetListId = getListIdFromName(event.name)
  const cardId = getDroppedCardId(state, event)
  const card = findBoardCard(state, cardId)
  if (!state.credentials || !targetListId || !card) {
    clearDragState(state)
    requestRerender()
    return
  }
  clearDragState(state)
  await moveCardToList(context, card.id, targetListId, 'top')
}
