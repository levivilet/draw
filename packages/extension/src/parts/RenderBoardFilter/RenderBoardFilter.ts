import {
  AriaRoles,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const renderBoardFilterPopup = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { boardFilterOpen, draftBoardFilter } = state
  if (!boardFilterOpen) {
    return []
  }
  return [
    {
      'aria-label': DrawStrings.filterCards(),
      childCount: 3,
      className: 'DrawBoardFilterPopup',
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'DrawBoardFilterPopupHeader',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'DrawBoardFilterPopupTitle',
      type: VirtualDomElements.Div,
    },
    text(DrawStrings.filter()),
    {
      'aria-label': DrawStrings.close(),
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawBoardFilterCloseButton',
      ),
      name: 'closeBoardFilter',
      onClick: DomEventListenerFunctions.HandleClick,
      title: DrawStrings.close(),
      type: VirtualDomElements.Button,
    },
    text('x'),
    {
      childCount: 2,
      className: 'DrawBoardFilterField',
      type: VirtualDomElements.Label,
    },
    {
      childCount: 1,
      className: 'DrawBoardFilterLabel',
      type: VirtualDomElements.Span,
    },
    text(DrawStrings.keyword()),
    {
      autocomplete: 'off',
      childCount: 0,
      className: MergeClassNames.mergeClassNames(
        'DrawInput',
        'DrawBoardFilterInput',
      ),
      name: 'boardFilter',
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      placeholder: DrawStrings.filterCards(),
      type: VirtualDomElements.Input,
      value: draftBoardFilter,
    },
    {
      childCount: 1,
      className: 'DrawBoardFilterHint',
      type: VirtualDomElements.Div,
    },
    text(DrawStrings.filterCardsHint()),
  ]
}

const renderBoardFilterOverlay = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { boardFilterOpen } = state
  if (!boardFilterOpen) {
    return []
  }
  return [
    {
      childCount: 0,
      className: 'DrawBoardFilterOverlay',
      name: 'closeBoardFilter',
      onClick: DomEventListenerFunctions.HandleClick,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ]
}

export const renderBoardFilter = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const overlay = renderBoardFilterOverlay(state)
  const popup = renderBoardFilterPopup(state)
  return [...overlay, ...popup]
}
