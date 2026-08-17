import type { DrawList } from '../DrawTypes/DrawTypes.ts'
import type { DrawViewState } from '../DrawViewState/DrawViewState.ts'

export const updateBoardDetailList = (
  state: Readonly<DrawViewState>,
  list: Readonly<DrawList>,
): void => {
  const mutableState = state as DrawViewState
  if (!mutableState.boardDetail) {
    return
  }
  mutableState.boardDetail = {
    ...mutableState.boardDetail,
    lists: mutableState.boardDetail.lists.map((item) => {
      return item.id === list.id ? list : item
    }),
  }
}
