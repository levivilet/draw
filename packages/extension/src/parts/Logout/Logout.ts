import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'
import { createInitialState } from '../CreateInitialState/CreateInitialState.ts'

export const logout = async (
  context: DrawViewActionContext,
): Promise<void> => {
  const {
    currentBoardStorage,
    imageCache,
    recentStorage,
    requestRerender,
    storage,
  } = context
  const state = context.state as DrawViewState
  await storage.delete()
  await recentStorage.delete()
  await currentBoardStorage.delete()
  imageCache.dispose()
  Object.assign(state, createInitialState())
  requestRerender()
}
