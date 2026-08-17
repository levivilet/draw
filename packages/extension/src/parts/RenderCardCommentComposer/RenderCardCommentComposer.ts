import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderCardCommentButton } from '../RenderCardCommentButton/RenderCardCommentButton.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardCommentComposer = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftComment, savingComment, writingComment } = state
  if (!writingComment) {
    return [
      {
        childCount: 1,
        className: MergeClassNames.mergeClassNames(
          'DrawButton',
          'DrawCardCommentWriteButton',
        ),
        name: 'startWriteComment',
        onClick: DomEventListenerFunctions.HandleClick,
        type: VirtualDomElements.Button,
      },
      text(DrawStrings.writeAComment()),
    ]
  }
  return [
    {
      childCount: 2,
      className: 'DrawCardCommentComposer',
      type: VirtualDomElements.Div,
    },
    {
      autofocus: true,
      childCount: 0,
      className: MergeClassNames.mergeClassNames(
        'DrawTextArea',
        'DrawCardCommentTextArea',
      ),
      disabled: savingComment,
      name: 'cardComment',
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      placeholder: DrawStrings.writeACommentPlaceholder(),
      type: VirtualDomElements.TextArea,
      value: draftComment,
    },
    {
      childCount: 2,
      className: 'DrawCardCommentActions',
      type: VirtualDomElements.Div,
    },
    ...renderCardCommentButton(
      'submitComment',
      savingComment ? DrawStrings.saving() : DrawStrings.save(),
      MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardCommentSaveButton',
      ),
      savingComment,
    ),
    ...renderCardCommentButton(
      'cancelWriteComment',
      DrawStrings.cancel(),
      MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawCardCommentCancelButton',
      ),
      savingComment,
    ),
  ]
}
