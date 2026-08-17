import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMatchingLabels } from '../GetMatchingLabels/GetMatchingLabels.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardLabelChoice } from '../RenderCardLabelChoice/RenderCardLabelChoice.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardLabelPickerContent = (
  state: Readonly<DrawViewState>,
  labels: readonly DrawLabel[] | undefined,
): readonly VirtualDomNode[] => {
  const { boardLabelsLoading, draftLabelSearchQuery } = state
  if (boardLabelsLoading) {
    return [
      {
        childCount: 1,
        className: 'DrawCardLabelPickerEmpty',
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.loadingLabels()),
    ]
  }
  const matchingLabels = getMatchingLabels(state)
  if (matchingLabels.length === 0) {
    if (draftLabelSearchQuery.trim()) {
      return [
        {
          childCount: 1,
          className: MergeClassNames.mergeClassNames(
            'DrawButton',
            'DrawCardLabelCreateButton',
          ),
          name: 'openCardLabelCreate',
          onClick: DomEventListenerFunctions.HandleClick,
          type: VirtualDomElements.Button,
        },
        text(DrawStrings.createNewLabel()),
      ]
    }
    return [
      {
        childCount: 1,
        className: 'DrawCardLabelPickerEmpty',
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.noLabelsAvailable()),
    ]
  }
  return [
    {
      childCount: matchingLabels.length,
      className: 'DrawCardLabelPickerList',
      type: VirtualDomElements.Div,
    },
    ...matchingLabels.flatMap((label) =>
      renderCardLabelChoice(state, labels, label),
    ),
  ]
}
