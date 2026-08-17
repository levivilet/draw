import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const updateBoardDetailCard = (
  state: Readonly<DrawViewState>,
  card: DrawCard,
): void => {
  const mutableState = state as DrawViewState
  if (!mutableState.boardDetail) {
    return
  }
  mutableState.boardDetail = {
    ...mutableState.boardDetail,
    lists: mutableState.boardDetail.lists.map((list) => {
      return {
        ...list,
        cards: list.cards.map((item) => {
          if (item.id !== card.id) {
            return item
          }
          return {
            ...item,
            ...card,
          }
        }),
      }
    }),
  }
}
