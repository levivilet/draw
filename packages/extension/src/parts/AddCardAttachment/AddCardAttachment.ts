import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawAttachment,
  DrawCard,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import { deleteCachedCardAttachments } from '../GetCardDetail/GetCardDetail.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const addCardAttachment = async (
  fetchLike: FetchLike,
  card: DrawCard,
  file: File,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<DrawAttachment> => {
  const formData = new FormData()
  formData.set('file', file, file.name)
  formData.set('name', file.name)
  if (file.type) {
    formData.set('mimeType', file.type)
  }
  const attachment = await requestJson<DrawAttachment>(
    fetchLike,
    `/cards/${card.id}/attachments`,
    credentials,
    {},
    {
      body: formData,
      method: 'POST',
    },
  )
  await deleteCachedCardAttachments(cache, card, credentials)
  return attachment
}
