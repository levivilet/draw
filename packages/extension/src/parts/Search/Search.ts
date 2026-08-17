// cspell:ignore prefs

import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type { FetchLike } from '../DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawCredentials,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'
import {
  normalizeSearchResponse,
  type DrawSearchResponse,
} from '../NormalizeSearchResponse/NormalizeSearchResponse.ts'
import { readCachedJson, requestJson } from '../RequestJson/RequestJson.ts'

const getSearchParams = (query: string): Readonly<Record<string, string>> => {
  return {
    board_fields: 'name,url,prefs',
    boards_limit: '10',
    card_fields: 'name,url,idBoard',
    cards_limit: '10',
    modelTypes: 'cards,boards',
    query,
  }
}

export const readCachedSearch = async (
  cache: DrawApiCache | undefined,
  query: string,
  credentials: DrawCredentials,
): Promise<readonly DrawSearchResult[] | undefined> => {
  const response = await readCachedJson<DrawSearchResponse>(
    cache,
    '/search',
    credentials,
    getSearchParams(query),
  )
  if (!response) {
    return undefined
  }
  return normalizeSearchResponse(response)
}

export const search = async (
  fetchLike: FetchLike,
  query: string,
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<readonly DrawSearchResult[]> => {
  const response = await requestJson<DrawSearchResponse>(
    fetchLike,
    '/search',
    credentials,
    getSearchParams(query),
    undefined,
    cache,
  )
  return normalizeSearchResponse(response)
}
