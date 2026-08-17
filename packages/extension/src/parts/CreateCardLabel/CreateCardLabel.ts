import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { addCardLabel } from '../CardLabelPicker/CardLabelPicker.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const openCardLabelCreate = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  const name = state.draftLabelSearchQuery.trim()
  if (!name) {
    return
  }
  state.cardLabelCreateOpen = true
  state.draftNewLabelColor = 'green'
  state.draftNewLabelName = name
  state.focusedName = 'newLabelName'
  requestRerender()
}

export const closeCardLabelCreate = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.cardLabelCreateOpen = false
  state.draftNewLabelColor = 'green'
  state.draftNewLabelName = ''
  state.focusedName = 'cardLabelSearch'
  requestRerender()
}

export const selectCardLabelColor = (
  context: Readonly<DrawViewActionContext>,
  color: string,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.draftNewLabelColor = color
  requestRerender()
}

export const createCardLabel = async (
  context: DrawViewActionContext,
): Promise<void> => {
  const { client, requestRerender } = context
  const state = context.state as DrawViewState
  const name = state.draftNewLabelName.trim()
  if (
    !state.credentials ||
    !state.boardDetail ||
    !state.selectedCardDetail ||
    !state.draftNewLabelColor ||
    state.savingNewLabel
  ) {
    return
  }
  if (!name) {
    state.error = DrawStrings.labelTitleRequired()
    requestRerender()
    return
  }
  state.error = ''
  state.savingNewLabel = true
  requestRerender()
  try {
    const label = await client.createLabel(
      state.boardDetail.board,
      {
        color: state.draftNewLabelColor,
        name,
      },
      state.credentials,
    )
    state.boardLabels = [...state.boardLabels, label]
    state.cardLabelCreateOpen = false
    state.draftLabelSearchQuery = ''
    state.draftNewLabelColor = 'green'
    state.draftNewLabelName = ''
    state.focusedName = 'cardLabelSearch'
    state.savingNewLabel = false
    await addCardLabel(context, label.id)
  } catch (error) {
    state.error = getErrorMessage(error)
  } finally {
    state.savingNewLabel = false
  }
  requestRerender()
}
