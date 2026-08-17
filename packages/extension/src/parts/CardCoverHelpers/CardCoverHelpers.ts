import type { DrawCard } from '../DrawTypes/DrawTypes.ts'
import {
  getAttachmentImageUrl,
  isImageAttachment,
} from '../AttachmentHelpers/AttachmentHelpers.ts'

const getCardAttachmentImageUrl = (card: Readonly<DrawCard>): string => {
  const attachment = card.attachments?.find(isImageAttachment)
  if (!attachment) {
    return ''
  }
  return getAttachmentImageUrl(attachment)
}

export const getCardCoverImageUrl = (card: Readonly<DrawCard>): string => {
  const { cover } = card
  if (!cover) {
    return getCardAttachmentImageUrl(card)
  }
  const scaledUrl = cover.scaled?.at(-1)?.url
  if (scaledUrl) {
    return scaledUrl
  }
  if (cover.url) {
    return cover.url
  }
  return cover.sharedSourceUrl || getCardAttachmentImageUrl(card)
}
