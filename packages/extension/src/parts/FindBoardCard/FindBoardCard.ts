import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const findBoardCard = (
  state: Readonly<DrawViewState>,
  cardId: string,
): DrawCard | undefined => {
  const lists = state.boardDetail?.lists || []
  for (const list of lists) {
    const card = list.cards.find((item) => item.id === cardId)
    if (card) {
      return card
    }
  }
  return undefined
}
