import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import type { VirtualDomSegment } from '../VirtualDomSegment/VirtualDomSegment.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getCardListId } from '../GetCardListId/GetCardListId.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardListOption } from '../RenderCardListOption/RenderCardListOption.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardListSelect = (
  state: Readonly<DrawViewState>,
  card: Readonly<DrawCard>,
): VirtualDomSegment => {
  const { boardDetail, movingCardId } = state
  const lists = boardDetail?.lists || []
  if (lists.length === 0) {
    return { childCount: 0, dom: [] }
  }
  const selectedListId = getCardListId(state, card)
  return {
    childCount: 1,
    dom: [
      {
        childCount: 2,
        className: 'DrawCardListSection',
        type: VirtualDomElements.Div,
      },
      {
        childCount: 1,
        className: 'DrawCardListLabel',
        type: VirtualDomElements.Label,
      },
      text(DrawStrings.list()),
      {
        childCount: lists.length,
        className: MergeClassNames.mergeClassNames(
          'DrawInput',
          'DrawCardListSelect',
        ),
        disabled: movingCardId === card.id,
        name: `cardList:${card.id}`,
        onInput: DomEventListenerFunctions.HandleInput,
        type: VirtualDomElements.Select,
        value: selectedListId,
      },
      ...lists.flatMap((list) => renderCardListOption(list, selectedListId)),
    ],
  }
}
