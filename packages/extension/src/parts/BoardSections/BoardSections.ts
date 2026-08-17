import type { RecentBoardView } from '../RecentBoardStorage/RecentBoardStorage.ts'
import type { DrawBoard } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export interface WorkspaceSection {
  readonly boards: readonly DrawBoard[]
  readonly name: string
}

export const parseDate = (value: string | undefined): number => {
  if (!value) {
    return 0
  }
  const time = Date.parse(value)
  if (Number.isNaN(time)) {
    return 0
  }
  return time
}

export const getLocalViewedAt = (
  recentBoardViews: readonly RecentBoardView[],
  boardId: string,
): number => {
  const recentBoardView = recentBoardViews.find((item) => {
    return item.boardId === boardId
  })
  return parseDate(recentBoardView?.viewedAt)
}

export const getBoardViewedAt = (
  state: Readonly<DrawViewState>,
  board: DrawBoard,
): number => {
  return Math.max(
    parseDate(board.dateLastView),
    getLocalViewedAt(state.recentBoardViews, board.id),
  )
}

export const sortBoardsByViewedAt = (
  state: Readonly<DrawViewState>,
  boards: readonly DrawBoard[],
): readonly DrawBoard[] => {
  const originalIndexes = new Map(
    state.boards.map((board, index) => [board.id, index]),
  )
  return boards.toSorted((a, b) => {
    const viewedAtDiff = getBoardViewedAt(state, b) - getBoardViewedAt(state, a)
    if (viewedAtDiff !== 0) {
      return viewedAtDiff
    }
    return (originalIndexes.get(a.id) ?? 0) - (originalIndexes.get(b.id) ?? 0)
  })
}

export const getRecentlyViewedBoards = (
  state: Readonly<DrawViewState>,
): readonly DrawBoard[] => {
  return sortBoardsByViewedAt(state, state.boards)
    .filter((board) => getBoardViewedAt(state, board) > 0)
    .slice(0, 4)
}

export const getWorkspaceName = (board: DrawBoard): string => {
  return (
    board.organization?.displayName ||
    board.organization?.name ||
    DrawStrings.personalBoards()
  )
}

export const getWorkspaceSections = (
  state: Readonly<DrawViewState>,
): readonly WorkspaceSection[] => {
  const sections = new Map<string, DrawBoard[]>()
  for (const board of state.boards) {
    const name = getWorkspaceName(board)
    const boards = sections.get(name) || []
    boards.push(board)
    sections.set(name, boards)
  }
  return Array.from(
    sections,
    (entry: readonly [string, readonly DrawBoard[]]): WorkspaceSection => {
      const [name, boards] = entry
      return {
        boards: sortBoardsByViewedAt(state, boards),
        name,
      }
    },
  )
}
