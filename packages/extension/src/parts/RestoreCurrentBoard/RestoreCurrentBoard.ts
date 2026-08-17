import type { DrawBoard } from '../DrawTypes/DrawTypes.ts'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { isSameJson } from '../CacheFirstHelpers/CacheFirstHelpers.ts'
import { getErrorMessage } from '../GetErrorMessage/GetErrorMessage.ts'

const findBoard = (
  boards: readonly DrawBoard[],
  boardId: string,
): DrawBoard | undefined => {
  return boards.find((board) => {
    return board.id === boardId
  })
}

export const restoreCurrentBoard = async (
  context: Readonly<DrawViewActionContext>,
): Promise<void> => {
  const { client, currentBoardStorage } = context
  const state = context.state as DrawViewState
  if (!state.credentials || state.error) {
    return
  }
  const boardId = await currentBoardStorage.read()
  if (!boardId) {
    return
  }
  const board = findBoard(state.boards, boardId)
  if (!board) {
    await currentBoardStorage.delete()
    return
  }
  state.loading = true
  state.error = ''
  try {
    const result = await client.getBoardDetailCacheFirst(
      board,
      state.credentials,
    )
    if (result.cached) {
      state.boardDetail = result.cached
      state.loading = false
    }
    const fresh = await result.fresh
    if (!isSameJson(state.boardDetail, fresh)) {
      state.boardDetail = fresh
    }
  } catch (error) {
    state.error = getErrorMessage(error)
    await currentBoardStorage.delete()
  } finally {
    state.loading = false
  }
}
