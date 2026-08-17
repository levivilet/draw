import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'

export const editCardTitle = (context: DrawViewActionContext): void => {
  const state = context.state as DrawViewState
  state.editingCardTitle = true
  context.requestRerender()
}

export const editCardDescription = (context: DrawViewActionContext): void => {
  const state = context.state as DrawViewState
  state.editingCardDescription = true
  state.focusedName = 'cardDescription'
  context.requestRerender()
}
