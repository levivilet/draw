import {
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getLabelColorClassName } from '../LabelHelpers/LabelHelpers.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardLabelColorChoice = (
  state: Readonly<DrawViewState>,
  color: string,
): VirtualDomNode => {
  const { draftNewLabelColor, savingNewLabel } = state
  const selected = draftNewLabelColor === color
  const colorClassName = getLabelColorClassName(color)
  const colorLabel = DrawStrings.selectLabelColor(color.replace('_', ' '))
  return {
    'aria-label': colorLabel,
    'aria-pressed': selected,
    childCount: 0,
    className: selected
      ? MergeClassNames.mergeClassNames(
        'DrawCardLabelColorChoice',
        colorClassName,
        'DrawCardLabelColorChoiceSelected',
      )
      : MergeClassNames.mergeClassNames(
        'DrawCardLabelColorChoice',
        colorClassName,
      ),
    disabled: savingNewLabel,
    name: `selectCardLabelColor:${color}`,
    onClick: DomEventListenerFunctions.HandleClick,
    title: colorLabel,
    type: VirtualDomElements.Button,
  }
}
