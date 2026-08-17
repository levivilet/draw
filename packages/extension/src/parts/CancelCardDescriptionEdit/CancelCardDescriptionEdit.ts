import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'

export const cancelCardDescriptionEdit = (
  context: DrawViewActionContext,
): void => {
  const state = context.state as DrawViewState
  state.draftCardDescription = state.selectedCardDetail?.card.desc || ''
  state.editingCardDescription = false
  state.focusedName = ''
  state.error = ''
  context.requestRerender()
}
