import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawLabel } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardDetailLabel } from '../RenderCardDetailLabel/RenderCardDetailLabel.ts'
import { renderCardLabelPicker } from '../RenderCardLabelPicker/RenderCardLabelPicker.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const renderLabels = (
  labels: readonly DrawLabel[] | undefined,
): readonly VirtualDomNode[] => {
  if (!labels || labels.length === 0) {
    return [
      {
        childCount: 1,
        className: MergeClassNames.mergeClassNames(
          'DrawButton',
          'DrawCardLabelAddButton',
        ),
        name: 'openCardLabelPicker',
        onClick: DomEventListenerFunctions.HandleClick,
        type: VirtualDomElements.Button,
      },
      text(DrawStrings.labels()),
    ]
  }
  return [
    {
      childCount: 2,
      className: 'DrawCardLabelRow',
      type: VirtualDomElements.Div,
    },
    {
      childCount: labels.length,
      className: 'DrawCardLabels',
      type: VirtualDomElements.Div,
    },
    ...labels.flatMap(renderCardDetailLabel),
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardLabelAddIconButton',
      ),
      name: 'openCardLabelPicker',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text('+'),
  ]
}

const renderLabelPicker = (
  state: Readonly<DrawViewState>,
  labels: readonly DrawLabel[] | undefined,
): readonly VirtualDomNode[] => {
  const { cardLabelPickerOpen } = state
  if (!cardLabelPickerOpen) {
    return []
  }
  return renderCardLabelPicker(state, labels)
}

export const renderCardDetailLabels = (
  state: Readonly<DrawViewState>,
  labels: readonly DrawLabel[] | undefined,
): readonly VirtualDomNode[] => {
  const { cardLabelPickerOpen } = state
  const labelDom = renderLabels(labels)
  const labelPickerDom = renderLabelPicker(state, labels)
  return [
    {
      childCount: 1 + (cardLabelPickerOpen ? 1 : 0),
      className: 'DrawCardLabelSection',
      type: VirtualDomElements.Div,
    },
    ...labelDom,
    ...labelPickerDom,
  ]
}
