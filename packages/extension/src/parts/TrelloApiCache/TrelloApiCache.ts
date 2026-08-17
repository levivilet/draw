import type { DrawCredentials } from '../DrawTypes/DrawTypes.ts'

export interface DrawApiCache {
  readonly delete: (
    requestUrl: string,
    credentials: DrawCredentials,
  ) => Promise<void>
  readonly read: <T>(
    requestUrl: string,
    credentials: DrawCredentials,
  ) => Promise<T | undefined>
  readonly write: <T>(
    requestUrl: string,
    credentials: DrawCredentials,
    value: T,
  ) => Promise<void>
}

export interface MemoryDrawApiCache extends DrawApiCache {
  readonly keys: () => readonly string[]
}

export const trelloApiCacheName = 'builtindraw.api-responses'
export const testDrawApiCacheName = 'test.builtindraw.api-responses'
export const credentialFingerprintSearchParam = 'credential'

const textEncoder = new TextEncoder()

export const getCredentialFingerprint = async (
  credentials: DrawCredentials,
): Promise<string | undefined> => {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    return undefined
  }
  const value = textEncoder.encode(`${credentials.apiKey}:${credentials.token}`)
  const digest = await subtle.digest('SHA-256', value)
  return Array.from(new Uint8Array(digest), (byte) => {
    return byte.toString(16).padStart(2, '0')
  }).join('')
}

export const createDrawApiCacheRequestUrl = async (
  requestUrl: string,
  credentials: DrawCredentials,
): Promise<string | undefined> => {
  const credentialFingerprint = await getCredentialFingerprint(credentials)
  if (!credentialFingerprint) {
    return undefined
  }
  const url = new URL(requestUrl)
  url.searchParams.delete('key')
  url.searchParams.delete('token')
  url.searchParams.set(credentialFingerprintSearchParam, credentialFingerprint)
  url.searchParams.sort()
  return url.href
}

export const createCacheStorageDrawApiCache = (
  cacheStorage: Readonly<CacheStorage> | undefined = globalThis.caches,
  selectedCacheName = trelloApiCacheName,
): DrawApiCache | undefined => {
  if (!cacheStorage) {
    return undefined
  }
  return {
    async delete(
      requestUrl: string,
      credentials: DrawCredentials,
    ): Promise<void> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (!cacheRequestUrl) {
        return
      }
      const cache = await cacheStorage.open(selectedCacheName)
      await cache.delete(cacheRequestUrl)
    },
    async read<T>(
      requestUrl: string,
      credentials: DrawCredentials,
    ): Promise<T | undefined> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (!cacheRequestUrl) {
        return undefined
      }
      const cache = await cacheStorage.open(selectedCacheName)
      const response = await cache.match(cacheRequestUrl)
      if (!response) {
        return undefined
      }
      return response.json() as Promise<T>
    },
    async write<T>(
      requestUrl: string,
      credentials: DrawCredentials,
      value: T,
    ): Promise<void> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (!cacheRequestUrl) {
        return
      }
      const cache = await cacheStorage.open(selectedCacheName)
      await cache.put(cacheRequestUrl, Response.json(value))
    },
  }
}

export const createMemoryDrawApiCache = (): MemoryDrawApiCache => {
  const values = new Map<string, unknown>()
  return {
    async delete(
      requestUrl: string,
      credentials: DrawCredentials,
    ): Promise<void> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (cacheRequestUrl) {
        values.delete(cacheRequestUrl)
      }
    },
    keys(): readonly string[] {
      return values.keys().toArray()
    },
    async read<T>(
      requestUrl: string,
      credentials: DrawCredentials,
    ): Promise<T | undefined> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (!cacheRequestUrl || !values.has(cacheRequestUrl)) {
        return undefined
      }
      return values.get(cacheRequestUrl) as T
    },
    async write<T>(
      requestUrl: string,
      credentials: DrawCredentials,
      value: T,
    ): Promise<void> {
      const cacheRequestUrl = await createDrawApiCacheRequestUrl(
        requestUrl,
        credentials,
      )
      if (cacheRequestUrl) {
        values.set(cacheRequestUrl, value)
      }
    },
  }
}
