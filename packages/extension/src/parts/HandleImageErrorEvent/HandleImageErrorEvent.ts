import type {
  DrawViewActionContext,
  DrawViewState,
} from '../DrawViewState/DrawViewState.ts'

export const handleImageErrorEvent = (
  context: Readonly<DrawViewActionContext>,
  attachmentId: string,
): void => {
  const state = context.state as DrawViewState
  if (
    !attachmentId ||
    state.failedCardAttachmentImageIds.includes(attachmentId)
  ) {
    return
  }
  state.failedCardAttachmentImageIds = [
    ...state.failedCardAttachmentImageIds,
    attachmentId,
  ]
}
