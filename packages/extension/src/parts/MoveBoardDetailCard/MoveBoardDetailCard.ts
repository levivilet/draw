import type { DrawCard, DrawCardMove } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const moveBoardDetailCard = (
  state: Readonly<DrawViewState>,
  card: Readonly<DrawCard>,
  targetListId: string,
  position: DrawCardMove['pos'],
): void => {
  const mutableState = state as DrawViewState
  if (!mutableState.boardDetail) {
    return
  }
  mutableState.boardDetail = {
    ...mutableState.boardDetail,
    lists: mutableState.boardDetail.lists.map((list) => {
      const cardsWithoutMoved = list.cards.filter((item) => {
        return item.id !== card.id
      })
      if (list.id !== targetListId) {
        return {
          ...list,
          cards: cardsWithoutMoved,
        }
      }
      return {
        ...list,
        cards:
          position === 'top'
            ? [card, ...cardsWithoutMoved]
            : [...cardsWithoutMoved, card],
      }
    }),
  }
}
