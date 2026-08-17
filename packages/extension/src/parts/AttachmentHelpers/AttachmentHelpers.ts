import type { DrawAttachment } from '../DrawTypes/DrawTypes.ts'

const imageUrlPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i

export const isImageAttachment = (
  attachment: Readonly<DrawAttachment>,
): boolean => {
  if (attachment.mimeType?.startsWith('image/')) {
    return true
  }
  if (attachment.url && imageUrlPattern.test(attachment.url)) {
    return true
  }
  return Boolean(attachment.previews?.some((preview) => preview.url))
}

export const getAttachmentImageUrl = (
  attachment: Readonly<DrawAttachment>,
): string => {
  if (attachment.url && imageUrlPattern.test(attachment.url)) {
    return attachment.url
  }
  if (attachment.mimeType?.startsWith('image/') && attachment.url) {
    return attachment.url
  }
  const previews = attachment.previews || []
  return previews.at(-1)?.url || attachment.url || ''
}
