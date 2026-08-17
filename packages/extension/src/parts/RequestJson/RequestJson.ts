import type { DrawApiCache } from '../DrawApiCache/DrawApiCache.ts'
import type {
  FetchLike,
  DrawRequestInit,
  DrawResponse,
} from '../DrawClientTypes/DrawClientTypes.ts'
import type { DrawCredentials } from '../DrawTypes/DrawTypes.ts'

const baseUrl = 'https://apidraw.com/1'
const batchRequestLimit = 10
const successfulResponseStatusPattern = /^2\d\d$/

export interface DrawBatchRequest {
  readonly params?: Readonly<Record<string, string>>
  readonly path: string
}

const getErrorMessage = async (response: DrawResponse): Promise<string> => {
  const text = await response.text()
  if (text) {
    return `Draw request failed: ${response.status} ${text}`
  }
  return `Draw request failed: ${response.status} ${response.statusText}`
}

const isGetRequest = (init?: DrawRequestInit): boolean => {
  return !init?.method || init.method.toUpperCase() === 'GET'
}

const createDrawBatchPath = (
  path: string,
  params: Readonly<Record<string, string>> = {},
): string => {
  const url = new URL(`${baseUrl}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return `${url.pathname.slice(2)}${url.search}`
}

const writeCachedJson = async (
  cache: DrawApiCache | undefined,
  path: string,
  credentials: DrawCredentials,
  params: Readonly<Record<string, string>>,
  value: unknown,
): Promise<void> => {
  if (!cache) {
    return
  }
  try {
    const requestUrl = createDrawRequestUrl(path, credentials, params)
    await cache.write(requestUrl, credentials, value)
  } catch {
    // A quota or Cache Storage failure should not fail a Draw request.
  }
}

const parseBatchResponse = (
  value: unknown,
  requestCount: number,
): readonly unknown[] => {
  if (!Array.isArray(value) || value.length !== requestCount) {
    throw new Error('Draw batch request returned an invalid response')
  }
  return value.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error('Draw batch request returned an invalid response')
    }
    const entries = Object.entries(item)
    if (entries.length !== 1) {
      throw new Error('Draw batch request returned an invalid response')
    }
    const [status, body] = entries[0]
    if (!successfulResponseStatusPattern.test(status)) {
      const message =
        typeof body === 'string'
          ? body
          : JSON.stringify(body) || 'Unknown error'
      throw new Error(`Draw request failed: ${status} ${message}`)
    }
    return body
  })
}

export const createDrawRequestUrl = (
  path: string,
  credentials: DrawCredentials,
  params: Readonly<Record<string, string>> = {},
): string => {
  const url = new URL(`${baseUrl}${path}`)
  url.searchParams.set('key', credentials.apiKey)
  url.searchParams.set('token', credentials.token)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.href
}

export const readCachedJson = async <T>(
  cache: DrawApiCache | undefined,
  path: string,
  credentials: DrawCredentials,
  params: Readonly<Record<string, string>> = {},
): Promise<T | undefined> => {
  if (!cache) {
    return undefined
  }
  try {
    const requestUrl = createDrawRequestUrl(path, credentials, params)
    return await cache.read<T>(requestUrl, credentials)
  } catch {
    return undefined
  }
}

export const deleteCachedJson = async (
  cache: DrawApiCache | undefined,
  path: string,
  credentials: DrawCredentials,
  params: Readonly<Record<string, string>> = {},
): Promise<void> => {
  if (!cache) {
    return
  }
  try {
    const requestUrl = createDrawRequestUrl(path, credentials, params)
    await cache.delete(requestUrl, credentials)
  } catch {
    // Cache cleanup should not make a successful Draw write look failed.
  }
}

export const requestJson = async <T>(
  fetchLike: FetchLike,
  path: string,
  credentials: DrawCredentials,
  params: Readonly<Record<string, string>> = {},
  init?: DrawRequestInit,
  cache?: DrawApiCache,
): Promise<T> => {
  const requestUrl = createDrawRequestUrl(path, credentials, params)
  const response = await fetchLike(requestUrl, init)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  const value = (await response.json()) as T
  if (cache && isGetRequest(init)) {
    await writeCachedJson(cache, path, credentials, params, value)
  }
  return value
}

export const requestJsonBatch = async <T extends readonly unknown[]>(
  fetchLike: FetchLike,
  requests: readonly DrawBatchRequest[],
  credentials: DrawCredentials,
  cache?: DrawApiCache,
): Promise<T> => {
  if (requests.length === 0) {
    return [] as unknown as T
  }
  if (requests.length > batchRequestLimit) {
    throw new Error(
      `Draw batch requests support at most ${batchRequestLimit} requests`,
    )
  }
  const paths = requests.map(({ params, path }) => {
    return createDrawBatchPath(path, params)
  })
  const requestUrl = createDrawRequestUrl('/batch', credentials, {
    urls: paths.join(','),
  })
  const response = await fetchLike(requestUrl)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  const values = parseBatchResponse(await response.json(), requests.length)
  await Promise.all(
    requests.map((request, index) => {
      return writeCachedJson(
        cache,
        request.path,
        credentials,
        request.params || {},
        values[index],
      )
    }),
  )
  return values as T
}
