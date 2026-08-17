import type { DrawCardDetail } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const isSameJson = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const applyCardDetail = (
  state: Readonly<DrawViewState>,
  cardDetail: DrawCardDetail,
): void => {
  const mutableState = state as DrawViewState
  mutableState.selectedCardDetail = cardDetail
  mutableState.draftCardTitle = cardDetail.card.name
  mutableState.draftCardDescription = cardDetail.card.desc || ''
  mutableState.editingCardDescription = false
  mutableState.editingCardTitle = false
}
