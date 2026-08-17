import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const getCardListId = (
  state: Readonly<DrawViewState>,
  card: Readonly<DrawCard>,
): string => {
  if (card.idList) {
    return card.idList
  }
  const { boardDetail } = state
  const lists = boardDetail?.lists || []
  const list = lists.find((item) => {
    return item.cards.some((listCard) => {
      return listCard.id === card.id
    })
  })
  return list?.id || ''
}
