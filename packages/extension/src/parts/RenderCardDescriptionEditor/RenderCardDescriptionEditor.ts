import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardDescriptionCancelButton } from '../RenderCardDescriptionCancelButton/RenderCardDescriptionCancelButton.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDescriptionEditor = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftCardDescription, savingCardDetail } = state
  return [
    {
      childCount: 2,
      className: 'DrawCardDescriptionEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(
        'DrawTextArea',
        'DrawCardDescriptionTextArea',
      ),
      name: 'cardDescription',
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: DrawStrings.addDetailedDescription(),
      type: VirtualDomElements.TextArea,
      value: draftCardDescription,
    },
    {
      childCount: 2,
      className: 'DrawCardDetailActions',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardDetailSaveButton',
      ),
      name: 'saveCardDetail',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(savingCardDetail ? DrawStrings.saving() : DrawStrings.save()),
    ...renderCardDescriptionCancelButton(savingCardDetail),
  ]
}
