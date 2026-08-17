import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type {
  DrawBoard,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import {
  getRecentlyViewedBoards,
  getWorkspaceSections,
  type WorkspaceSection,
} from '../BoardSections/BoardSections.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import { renderError } from '../RenderError/RenderError.ts'
import { renderListTitle } from '../RenderListTitle/RenderListTitle.ts'
import { renderTitle } from '../RenderTitle/RenderTitle.ts'
import { renderToolbar } from '../RenderToolbar/RenderToolbar.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

interface VirtualDomSegment {
  readonly childCount: number
  readonly dom: readonly VirtualDomNode[]
}

const renderSearchForm = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { draftSearchQuery } = state
  return [
    {
      childCount: 1,
      className: 'DrawSearchForm',
      name: 'search',
      onSubmit: DomEventListenerFunctions.HandleSubmit,
      type: VirtualDomElements.Form,
    },
    {
      childCount: 0,
      className: 'DrawInput',
      name: 'search',
      onBlur: DomEventListenerFunctions.HandleBlur,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: DrawStrings.searchDraw(),
      type: VirtualDomElements.Input,
      value: draftSearchQuery,
    },
  ]
}

const renderBoardButton = (
  board: Readonly<DrawBoard>,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'DrawBoardButton',
      name: `board:${board.id}`,
      onClick: DomEventListenerFunctions.HandleClick,
      type: VirtualDomElements.Button,
    },
    text(board.name),
  ]
}

const renderBoardGrid = (
  boards: readonly DrawBoard[],
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: boards.length,
      className: 'DrawBoardGrid',
      type: VirtualDomElements.Div,
    },
    ...boards.flatMap(renderBoardButton),
  ]
}

const renderRecentlyViewed = (
  boards: readonly DrawBoard[],
): VirtualDomSegment => {
  if (boards.length === 0) {
    return { childCount: 0, dom: [] }
  }
  return {
    childCount: 1,
    dom: [
      {
        childCount: 2,
        className: 'DrawSection',
        type: VirtualDomElements.Div,
      },
      ...renderListTitle(DrawStrings.recentlyViewed()),
      ...renderBoardGrid(boards),
    ],
  }
}

const renderWorkspaceSection = (
  section: Readonly<WorkspaceSection>,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'DrawWorkspace',
      type: VirtualDomElements.Div,
    },
    ...renderListTitle(section.name),
    ...renderBoardGrid(section.boards),
  ]
}

const renderSearchResult = (
  result: Readonly<DrawSearchResult>,
): readonly VirtualDomNode[] => {
  if (result.type === 'board') {
    return [
      {
        childCount: 1,
        className: 'DrawSearchResult',
        name: `board:${result.id}`,
        onClick: DomEventListenerFunctions.HandleClick,
        type: VirtualDomElements.Button,
      },
      text(DrawStrings.boardSearchResult(result.name)),
    ]
  }
  return [
    {
      childCount: 1,
      className: 'DrawSearchResult',
      type: VirtualDomElements.Div,
    },
    text(DrawStrings.cardSearchResult(result.name)),
  ]
}

const renderSearchContent = (
  state: Readonly<DrawViewState>,
): VirtualDomSegment => {
  const { activeSearchQuery, loading, searchResults } = state
  if (loading) {
    return { childCount: 1, dom: [text(DrawStrings.searching())] }
  }
  if (searchResults.length === 0) {
    return {
      childCount: 2,
      dom: [
        ...renderListTitle(DrawStrings.searchResultsFor(activeSearchQuery)),
        text(DrawStrings.noSearchResults()),
      ],
    }
  }
  return {
    childCount: 1,
    dom: [
      {
        childCount: 2,
        className: 'DrawSearchSection',
        type: VirtualDomElements.Div,
      },
      ...renderListTitle(DrawStrings.searchResultsFor(activeSearchQuery)),
      {
        childCount: searchResults.length,
        className: 'DrawSearchResults',
        type: VirtualDomElements.Div,
      },
      ...searchResults.flatMap(renderSearchResult),
    ],
  }
}

const renderBoardContent = (
  state: Readonly<DrawViewState>,
): VirtualDomSegment => {
  const { activeSearchQuery, boards, loading } = state
  if (activeSearchQuery) {
    return renderSearchContent(state)
  }
  if (loading) {
    return { childCount: 1, dom: [text(DrawStrings.loadingBoards())] }
  }
  if (boards.length === 0) {
    return { childCount: 1, dom: [text(DrawStrings.noBoardsFound())] }
  }
  const recentBoards = getRecentlyViewedBoards(state)
  const workspaceSections = getWorkspaceSections(state)
  const recentlyViewed = renderRecentlyViewed(recentBoards)
  return {
    childCount: recentlyViewed.childCount + 1,
    dom: [
      ...recentlyViewed.dom,
      {
        childCount: 1 + workspaceSections.length,
        className: 'DrawWorkspaces',
        type: VirtualDomElements.Div,
      },
      ...renderListTitle(DrawStrings.yourWorkspaces()),
      ...workspaceSections.flatMap(renderWorkspaceSection),
    ],
  }
}

const renderSearchToolbar = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { searchEnabled } = state
  if (!searchEnabled) {
    return []
  }
  return renderToolbar([renderSearchForm(state)])
}

export const renderBoards = (
  state: Readonly<DrawViewState>,
): readonly VirtualDomNode[] => {
  const { error } = state
  const boardContent = renderBoardContent(state)
  const errorDom = renderError(error)
  const searchToolbar = renderSearchToolbar(state)
  return [
    {
      childCount:
        1 +
        boardContent.childCount +
        (searchToolbar.length > 0 ? 1 : 0) +
        (errorDom.length > 0 ? 1 : 0),
      className: MergeClassNames.mergeClassNames('DrawView', 'DrawBoards'),
      name: 'boards',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      type: VirtualDomElements.Div,
    },
    ...searchToolbar,
    ...renderTitle(DrawStrings.boards()),
    ...boardContent.dom,
    ...errorDom,
  ]
}
