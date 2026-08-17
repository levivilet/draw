import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const getTitle = (state: Readonly<DrawViewState>): string => {
  const { boardDetail } = state
  if (boardDetail) {
    return DrawStringsdrawBoard(boardDetail.board.name)
  }
  return DrawStringsdraw()
}
