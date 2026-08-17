import type { ViewEvent } from '@lvce-editor/api'
import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'

const listTitlePrefix = 'listTitle:'

export const handleFocusEvent = (
  context: Readonly<DrawViewActionContext>,
  event: Readonly<ViewEvent>,
): void => {
  const state = context.state as DrawViewState
  state.focusedName = event.name || ''
  if (!event.name?.startsWith(listTitlePrefix)) {
    return
  }
  const listId = event.name.slice(listTitlePrefix.length)
  const list = state.boardDetail?.lists.find((item) => {
    return item.id === listId
  })
  if (!list) {
    return
  }
  const title = state.draftListTitles[listId] ?? list.name
  state.pendingSelections = [
    {
      end: title.length,
      name: event.name,
      start: 0,
    },
  ]
}
