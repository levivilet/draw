import type { DrawList } from '../DrawTypes/DrawTypes.ts'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const addListFormName = 'addList'

const appendList = (
  state: Readonly<DrawViewState>,
  list: DrawList,
): void => {
  if (!state.boardDetail) {
    return
  }
  const mutableState = state as DrawViewState
  mutableState.boardDetail = {
    ...state.boardDetail,
    lists: [...state.boardDetail.lists, list],
  }
}

export const startAddList = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.addingList = true
  state.draftNewListTitle = ''
  state.focusedName = 'newListTitle'
  state.savingNewList = false
  state.error = ''
  requestRerender()
}

export const cancelAddList = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.addingList = false
  state.draftNewListTitle = ''
  state.savingNewList = false
  state.error = ''
  requestRerender()
}

export const submitAddList = async (
  context: Readonly<DrawViewActionContext>,
  formName: string | undefined,
): Promise<boolean> => {
  if (formName !== addListFormName) {
    return false
  }
  const { client, requestRerender } = context
  const state = context.state as DrawViewState
  if (!state.credentials || !state.boardDetail || state.savingNewList) {
    return true
  }
  const name = state.draftNewListTitle.trim()
  state.addingList = true
  if (!name) {
    state.error = DrawStrings.listTitleRequired()
    requestRerender()
    return true
  }
  state.savingNewList = true
  state.error = ''
  requestRerender()
  try {
    const list = await client.createList(
      state.boardDetail.board,
      {
        name,
        pos: 'bottom',
      },
      state.credentials,
    )
    appendList(state, list)
    state.addingList = false
    state.draftNewListTitle = ''
    state.error = ''
  } catch (error) {
    state.error = getErrorMessage(error)
  }
  state.savingNewList = false
  requestRerender()
  return true
}
