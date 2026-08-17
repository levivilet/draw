import {
  text,
  VirtualDomElements,
  type VirtualDomNode,
} from '@lvce-editor/virtual-dom-worker'
import type { DrawAttachment } from '../DrawTypes/DrawTypes.ts'
import { getAttachmentImageUrl } from '../AttachmentHelpers/AttachmentHelpers.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as DrawStrings from '../DrawStrings/DrawStrings.ts'

export const renderImageAttachment = (
  attachment: Readonly<DrawAttachment>,
  attachmentImageUrls: Readonly<Record<string, string>>,
  failed: boolean,
): readonly VirtualDomNode[] => {
  const sourceUrl = getAttachmentImageUrl(attachment)
  const imageUrl = attachmentImageUrls[sourceUrl]
  if (failed || !imageUrl) {
    return [
      {
        childCount: 1,
        className: 'DrawCardDetailImageError',
        type: VirtualDomElements.Div,
      },
      text(DrawStrings.imageCouldNotBeLoaded()),
    ]
  }
  return [
    {
      alt: attachment.name || DrawStrings.cardAttachment(),
      childCount: 0,
      className: 'DrawCardDetailImage',
      name: attachment.id,
      onError: DomEventListenerFunctions.HandleImageError,
      src: imageUrl,
      type: VirtualDomElements.Img,
    },
  ]
}
