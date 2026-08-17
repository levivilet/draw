import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const updateSelectedCard = (
  state: Readonly<DrawViewState>,
  card: Readonly<DrawCard>,
): void => {
  const mutableState = state as DrawViewState
  if (mutableState.selectedCardDetail?.card.id !== card.id) {
    return
  }
  mutableState.selectedCardDetail = {
    ...mutableState.selectedCardDetail,
    card: {
      ...mutableState.selectedCardDetail.card,
      ...card,
    },
  }
}
