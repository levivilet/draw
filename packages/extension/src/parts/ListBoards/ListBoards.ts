// cspell:ignore prefs

import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawCredentials,
} from '../DrawTypes/DrawTypes.ts'
import { readCachedJson, requestJson } from '../RequestJson/RequestJson.ts'

const listBoardsParams = {
  fields: 'name,url,dateLastView,idOrganization,prefs',
  organization: 'true',
  organization_fields: 'name,displayName',
} as const

export const readCachedListBoards = (
  cache: DrawApiCache | undefined,
  credentials: DrawCredentials,
): Promise<readonly DrawBoard[] | undefined> => {
  return readCachedJson<readonly DrawBoard[]>(
    cache,
    '/members/me/boards',
    credentials,
    listBoardsParams,
  )
}

export const listBoards = (
  fetchLike: FetchLike,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<readonly DrawBoard[]> => {
  return requestJson<readonly DrawBoard[]>(
    fetchLike,
    '/members/me/boards',
    credentials,
    listBoardsParams,
    undefined,
    cache,
  )
}
