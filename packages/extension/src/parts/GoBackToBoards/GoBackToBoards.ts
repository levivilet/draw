import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { clearBoardSpecificState } from '../ClearBoardSpecificState/ClearBoardSpecificState.ts'

export const goBackToBoards = async (
  context: DrawViewActionContext,
): Promise<void> => {
  const { currentBoardStorage, requestRerender } = context
  const state = context.state as DrawViewState
  clearBoardSpecificState(state)
  state.error = ''
  await currentBoardStorage.delete()
  requestRerender()
}
