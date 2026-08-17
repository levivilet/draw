import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'
import { getBoardBackgroundCss } from '../BoardBackground/BoardBackground.ts'

const getCardDetailCss = (state: Readonly<DrawViewState>): string => {
  return `drawCardDetailPanel {
  --DrawCardDetailWidth: ${state.cardDetailWidth}px;
}`
}

export const getCss = (state: Readonly<DrawViewState>): string => {
  const boardBackgroundCss = state.boardDetail
    ? getBoardBackgroundCss(
      state.boardDetail.board,
      state.boardBackgroundEnabled,
    )
    : ''
  return [getCardDetailCss(state), boardBackgroundCss]
    .filter(Boolean)
    .join('\n\n')
}
