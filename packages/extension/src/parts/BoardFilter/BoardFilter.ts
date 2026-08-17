import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'

export const openBoardFilter = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.boardFilterOpen = true
  state.focusedName = 'boardFilter'
  requestRerender()
}

export const closeBoardFilter = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.boardFilterOpen = false
  if (state.focusedName === 'boardFilter') {
    state.focusedName = ''
  }
  requestRerender()
}
