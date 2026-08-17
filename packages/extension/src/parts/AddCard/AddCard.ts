import type { DrawCard, DrawList } from '../DrawTypes/DrawTypes.ts'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

const addCardPrefix = 'addCard:'

const findList = (
  state: Readonly<DrawViewState>,
  listId: string,
): DrawList | undefined => {
  return state.boardDetail?.lists.find((list) => {
    return list.id === listId
  })
}

const appendCardToList = (
  state: Readonly<DrawViewState>,
  listId: string,
  card: DrawCard,
): void => {
  if (!state.boardDetail) {
    return
  }
  const mutableState = state as DrawViewState
  mutableState.boardDetail = {
    ...state.boardDetail,
    lists: state.boardDetail.lists.map((list) => {
      if (list.id !== listId) {
        return list
      }
      return {
        ...list,
        cards: [...list.cards, card],
      }
    }),
  }
}

export const startAddCard = (
  context: Readonly<DrawViewActionContext>,
  listId: string,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.addingCardListId = listId
  state.focusedName = `newCardTitle:${listId}`
  state.savingNewCard = false
  state.error = ''
  requestRerender()
}

export const cancelAddCard = (
  context: Readonly<DrawViewActionContext>,
): void => {
  const { requestRerender } = context
  const state = context.state as DrawViewState
  state.addingCardListId = ''
  state.savingNewCard = false
  state.error = ''
  requestRerender()
}

export const submitAddCard = async (
  context: Readonly<DrawViewActionContext>,
  formName: string | undefined,
): Promise<void> => {
  if (!formName?.startsWith(addCardPrefix)) {
    return
  }
  const { client, requestRerender } = context
  const state = context.state as DrawViewState
  if (!state.credentials || !state.boardDetail || state.savingNewCard) {
    return
  }
  const listId = formName.slice(addCardPrefix.length)
  const list = findList(state, listId)
  if (!list) {
    return
  }
  const name = state.draftNewCardTitle.trim()
  state.addingCardListId = listId
  if (!name) {
    state.error = DrawStrings.cardTitleRequired()
    requestRerender()
    return
  }
  state.savingNewCard = true
  state.focusedName = ''
  state.error = ''
  requestRerender()
  try {
    const card = await client.createCard(
      list,
      {
        name,
        pos: 'bottom',
      },
      state.credentials,
    )
    appendCardToList(state, listId, card)
    state.addingCardListId = listId
    state.draftNewCardTitle = ''
    state.focusedName = `newCardTitle:${listId}`
    state.error = ''
  } catch (error) {
    state.focusedName = `newCardTitle:${listId}`
    state.error = getErrorMessage(error)
  }
  state.savingNewCard = false
  requestRerender()
}
