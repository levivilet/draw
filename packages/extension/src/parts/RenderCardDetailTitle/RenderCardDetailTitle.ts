import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const renderCardDetailTitle = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftCardTitle, editingCardTitle } = state
  const className = editingCardTitle
    ? MergeClassNames.mergeClassNames(
      'DrawCardDetailTitleInput',
      'DrawCardDetailTitleInputEditing',
    )
    : 'DrawCardDetailTitleInput'
  return [
    {
      childCount: 2,
      className: 'DrawCardDetailTitleSizer',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className,
      name: 'cardTitle',
      onBlur: DomEventListenerFunctions.HandleBlur,
      onClick: DomEventListenerFunctions.HandleClick,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      rows: 1,
      type: VirtualDomElements.TextArea,
      value: draftCardTitle,
    },
    {
      ariaHidden: true,
      childCount: 1,
      className: 'DrawCardDetailTitleMirror',
      type: VirtualDomElements.Div,
    },
    text(draftCardTitle || ' '),
  ]
}
