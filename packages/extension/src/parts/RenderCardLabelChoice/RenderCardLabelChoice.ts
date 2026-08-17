import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { hasCardLabel } from '../HasCardLabel/HasCardLabel.ts'
import {
  getLabelColorClassName,
  getLabelText,
} from '../LabelHelpers/LabelHelpers.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const renderCardLabelChoice = (
  state: Readonly<DrawViewState>,
  labels: readonly DrawLabel[] | undefined,
  label: Readonly<DrawLabel>,
): readonly VirtualDomNode[] => {
  const { addingCardLabelId } = state
  const checked = hasCardLabel(labels, label.id)
  return [
    {
      childCount: 2,
      className: 'DrawCardLabelChoice',
      disabled: Boolean(addingCardLabelId),
      name: `addCardLabel:${label.id}`,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    {
      checked,
      childCount: 0,
      className: 'DrawCardLabelChoiceCheckbox',
      inputType: 'checkbox',
      name: `cardLabelCheckbox:${label.id}`,
      tabIndex: -1,
      type: VirtualDomElements.Input,
    },
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawCardLabelChoiceText',
        getLabelColorClassName(label.color),
      ),
      type: VirtualDomElements.Span,
    },
    text(getLabelText(label)),
  ]
}
