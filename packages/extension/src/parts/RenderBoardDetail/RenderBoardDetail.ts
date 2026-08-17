import {
  AriaRoles,
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type {
  DrawBoardDetail,
  DrawList,
} from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import { getBoardBackgroundClassName } from '../BoardBackground/BoardBackground.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { filterListCards } from '../FilterBoardCards/FilterBoardCards.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderBoardFilter } from '../RenderBoardFilter/RenderBoardFilter.ts'
import { renderCardDetailPanel } from '../RenderCardDetailPanel/RenderCardDetailPanel.ts'
import { renderCards } from '../RenderCards/RenderCards.ts'
import { renderError } from '../RenderError/RenderError.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const renderListTitleInput = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  const { draftListTitles } = state
  return [
    {
      childCount: 1,
      className: 'DrawListTitleInputWrapper',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'DrawListTitleInput',
      name: `listTitle:${list.id}`,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      type: VirtualDomElements.Input,
      value: draftListTitles[list.id] ?? list.name,
    },
  ]
}

const renderListHeader = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'DrawListHeader',
      type: VirtualDomElements.Div,
    },
    ...renderListTitleInput(state, list),
    {
      childCount: 1,
      className: 'DrawListCardCount',
      type: VirtualDomElements.Div,
    },
    text(String(list.cards.length)),
  ]
}

const renderAddCardButton = (
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawAddCardButton',
      name: `addCard:${list.id}`,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(DrawStrings.addACard()),
  ]
}

const renderAddCardActions = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  const { savingNewCard } = state
  return [
    {
      childCount: 2,
      className: 'DrawAddCardActions',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(
        'DrawButton',
        'DrawAddCardSubmitButton',
      ),
      disabled: savingNewCard,
      inputType: 'button',
      name: `submitAddCard:${list.id}`,
      onClick: DomEventListenerFunctions.HandleClick,
      onPointerDown: DomEventListenerFunctions.HandleAddCardActionPointerDown,
      type: VirtualDomElements.Button,
    },
    text(DrawStrings.addCard()),
    {
      'aria-label': DrawStrings.close(),
      childCount: 1,
      className: 'DrawAddCardCloseButton',
      inputType: 'button',
      name: 'cancelAddCard',
      onClick: DomEventListenerFunctions.HandleClick,
      onPointerDown: DomEventListenerFunctions.HandleAddCardActionPointerDown,
      title: DrawStrings.close(),
      type: VirtualDomElements.Button,
    },
    text('X'),
  ]
}

const renderAddCardInput = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  const { draftNewCardTitle, savingNewCard } = state
  return [
    {
      childCount: 2,
      className: 'DrawAddCardForm',
      name: `addCard:${list.id}`,
      onSubmit: DomEventListenerFunctions.HandleSubmit,
      type: VirtualDomElements.Form,
    },
    {
      autocomplete: 'off',
      childCount: 0,
      className: 'DrawAddCardInput',
      disabled: savingNewCard,
      name: `newCardTitle:${list.id}`,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      onKeyDown: DomEventListenerFunctions.HandleKeyDown,
      placeholder: DrawStrings.enterCardTitle(),
      rows: 2,
      type: VirtualDomElements.TextArea,
      value: draftNewCardTitle,
    },
    ...renderAddCardActions(state, list),
  ]
}

const renderAddCardControl = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  const { addingCardListId } = state
  if (addingCardListId === list.id) {
    return renderAddCardInput(state, list)
  }
  return renderAddCardButton(list)
}

const renderAddListControl = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { addingList, draftNewListTitle, savingNewList } = state
  if (addingList) {
    return [
      {
        childCount: 1,
        className: 'DrawAddListForm',
        name: 'addList',
        onSubmit: DomEventListenerFunctions.HandleSubmit,
        type: VirtualDomElements.Form,
      },
      {
        autocomplete: 'off',
        childCount: 0,
        className: 'DrawAddListInput',
        disabled: savingNewList,
        name: 'newListTitle',
        onBlur: DomEventListenerFunctions.HandleBlur,
        onFocus: DomEventListenerFunctions.HandleFocus,
        onInput: DomEventListenerFunctions.HandleInput,
        onKeyDown: DomEventListenerFunctions.HandleKeyDown,
        placeholder: DrawStrings.enterListTitle(),
        type: VirtualDomElements.Input,
        value: draftNewListTitle,
      },
    ]
  }
  return [
    {
      childCount: 1,
      className: 'DrawAddListButton',
      name: 'startAddList',
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(DrawStrings.createNewList()),
  ]
}

const getListClassName = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): string => {
  const { dragTargetListId } = state
  if (dragTargetListId === list.id) {
    return MergeClassNames.mergeClassNames('DrawList', 'DrawListDragTarget')
  }
  return 'DrawList'
}

const renderList = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): readonly VirtualDomNode[] => {
  const { baseUrl, coverImageUrls, draftBoardFilter } = state
  const filteredList = filterListCards(list, draftBoardFilter)
  const cards = renderCards(baseUrl, coverImageUrls, filteredList.cards)
  return [
    {
      childCount: 3,
      className: getListClassName(state, list),
      'data-id': `list:${list.id}`,
      name: `list:${list.id}`,
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...renderListHeader(state, filteredList),
    {
      childCount: Math.max(1, filteredList.cards.length),
      className: 'DrawCards',
      type: VirtualDomElements.Div,
    },
    ...cards,
    ...renderAddCardControl(state, list),
  ]
}

const getCardDetailPanelChildCount = (
  state: Readonly<DrawViewState>,
): number => {
  const { cardDetailLoading, cardDetailPopupEnabled, selectedCardDetail } =
    state
  if (selectedCardDetail) {
    return cardDetailPopupEnabled ? 1 : 2
  }
  if (cardDetailLoading) {
    return 1
  }
  return 0
}

const renderBoardDetailContent = (
  state: Readonly<DrawViewState>,
  detail: Readonly<DrawBoardDetail>,
): readonly VirtualDomNode[] => {
  const { loading } = state
  if (loading) {
    return [text(DrawStrings.loadingBoard())]
  }
  const cardDetailPanel = renderCardDetailPanel(state)
  const cardDetailPanelChildCount = getCardDetailPanelChildCount(state)
  return [
    {
      childCount: 1 + cardDetailPanelChildCount,
      className: 'DrawBoardDetailContent',
      type: VirtualDomElements.Div,
    },
    {
      childCount: detail.lists.length + 1,
      className: 'DrawLists',
      type: VirtualDomElements.Div,
    },
    ...detail.lists.flatMap((list) => renderList(state, list)),
    ...renderAddListControl(state),
    ...cardDetailPanel,
  ]
}

export const renderBoardDetail = (
  state: Readonly<DrawViewState>,
  detail: Readonly<DrawBoardDetail>,
): readonly VirtualDomNode[] => {
  const { boardBackgroundEnabled, boardFilterOpen, error } = state
  const content = renderBoardDetailContent(state, detail)
  const filter = renderBoardFilter(state)
  const errorDom = renderError(error)
  return [
    {
      childCount: 1 + (boardFilterOpen ? 2 : 0) + (errorDom.length > 0 ? 1 : 0),
      className: getBoardBackgroundClassName(
        detail.board,
        boardBackgroundEnabled,
      ),
      type: VirtualDomElements.Div,
    },
    ...filter,
    ...content,
    ...errorDom,
  ]
}
