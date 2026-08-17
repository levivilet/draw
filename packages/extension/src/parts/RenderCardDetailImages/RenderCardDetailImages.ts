import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { DrawAttachment } from '../DrawTypes/DrawTypes.ts'
import type { VirtualDomSegment } from '../VirtualDomSegment/VirtualDomSegment.ts'
import { isImageAttachment } from '../AttachmentHelpers/AttachmentHelpers.ts'
import { renderImageAttachment } from '../RenderImageAttachment/RenderImageAttachment.ts'
import { renderListTitle } from '../RenderListTitle/RenderListTitle.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderCardDetailImages = (
  loading: boolean,
  attachments: readonly DrawAttachment[],
  attachmentImageUrls: Readonly<Record<string, string>>,
  failedImageIds: readonly string[],
): VirtualDomSegment => {
  if (loading) {
    return {
      childCount: 2,
      dom: [
        ...renderListTitle(DrawStrings.images()),
        {
          childCount: 1,
          className: 'DrawCardDetailEmpty',
          type: VirtualDomElements.Div,
        },
        text(DrawStrings.loadingImages()),
      ],
    }
  }
  const imageAttachments = attachments.filter(isImageAttachment)
  if (imageAttachments.length === 0) {
    return { childCount: 0, dom: [] }
  }
  return {
    childCount: 2,
    dom: [
      ...renderListTitle(DrawStrings.images()),
      {
        childCount: imageAttachments.length,
        className: 'DrawCardDetailImages',
        type: VirtualDomElements.Div,
      },
      ...imageAttachments.flatMap((attachment) =>
        renderImageAttachment(
          attachment,
          attachmentImageUrls,
          failedImageIds.includes(attachment.id),
        ),
      ),
    ],
  }
}
