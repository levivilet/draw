import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCredentials,
  DrawList,
  DrawListUpdate,
} from '../DrawTypes/DrawTypes.ts'
import { requestJson } from '../RequestJson/RequestJson.ts'

export const updateList = async (
  fetchLike: FetchLike,
  list: DrawList,
  update: DrawListUpdate,
  credentials: DrawCredentials,
): Promise<DrawList> => {
  const updatedList = await requestJson<Omit<DrawList, 'cards'>>(
    fetchLike,
    `/lists/${list.id}`,
    credentials,
    {
      fields: 'name',
      name: update.name,
    },
    {
      method: 'PUT',
    },
  )
  return {
    ...list,
    ...updatedList,
  }
}
