// cspell:ignore subrequest subresponses

import { expect, test } from '@jest/globals'
import type { DrawApiCache } from '../src/parts/DrawApiCache/DrawApiCache.ts'
import type {
  FetchLike,
  DrawResponse,
} from '../src/parts/DrawClientTypes/DrawClientTypes.ts'
import type {
  DrawBoard,
  DrawCard,
  DrawCredentials,
} from '../src/parts/DrawTypes/DrawTypes.ts'
import { readCachedBoardDetail } from '../src/parts/GetBoardDetail/GetBoardDetail.ts'
import { readCachedCardDetail } from '../src/parts/GetCardDetail/GetCardDetail.ts'
import { moveCard } from '../src/parts/MoveCard/MoveCard.ts'
import {
  createDrawRequestUrl,
  deleteCachedJson,
  readCachedJson,
  requestJson,
  requestJsonBatch,
} from '../src/parts/RequestJson/RequestJson.ts'
import { readCachedSearch } from '../src/parts/Search/Search.ts'
import {
  createMemoryDrawApiCache,
  createCacheStorageDrawApiCache,
  createDrawApiCacheRequestUrl,
  getCredentialFingerprint,
} from '../src/parts/DrawApiCache/DrawApiCache.ts'
import { createDrawClient } from '../src/parts/DrawClient/DrawClient.ts'

const credentials: DrawCredentials = {
  apiKey: 'abcdefghijklmnopqrstuvwxyz123456',
  token: 'abcdefghijklmnopqrstuvwxyz123456abcdefghijklmnopqrstuvwxyz123456',
}

const board: DrawBoard = {
  id: 'board-1',
  name: 'Roadmap',
}

const card: DrawCard = {
  id: 'card-1',
  name: 'Ship tests',
}

const failOnFetch: FetchLike = async () => {
  throw new Error('Fetch should not be called')
}

const withCryptoUnavailable = async (
  run: () => Promise<void>,
): Promise<void> => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: undefined,
  })
  try {
    await run()
  } finally {
    if (descriptor) {
      Object.defineProperty(globalThis, 'crypto', descriptor)
    } else {
      delete (globalThis as { crypto?: Crypto }).crypto
    }
  }
}

test('request helpers handle defaults, missing caches, and status text errors', async () => {
  expect(createDrawRequestUrl('/boards', credentials)).toContain(
    '/1/boards?key=',
  )
  await expect(
    readCachedJson(undefined, '/boards', credentials),
  ).resolves.toBeUndefined()
  await expect(
    deleteCachedJson(undefined, '/boards', credentials),
  ).resolves.toBeUndefined()

  const failedResponse: DrawResponse = {
    async json(): Promise<unknown> {
      return undefined
    },
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
    async text(): Promise<string> {
      return ''
    },
  }
  await expect(
    requestJson(async () => failedResponse, '/boards', credentials),
  ).rejects.toThrow('Draw request failed: 503 Service Unavailable')
})

test('requestJson caches explicit GET requests and tolerates cache failures', async () => {
  const writes: string[] = []
  const cache: DrawApiCache = {
    async delete(): Promise<void> { },
    async read<T>(): Promise<T | undefined> {
      return undefined
    },
    async write(requestUrl: string): Promise<void> {
      writes.push(requestUrl)
      throw new Error('Cache quota exceeded')
    },
  }
  const response: DrawResponse = {
    async json(): Promise<unknown> {
      return {
        ok: true,
      }
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    async text(): Promise<string> {
      return ''
    },
  }

  await expect(
    requestJson(
      async () => response,
      '/boards',
      credentials,
      undefined,
      { method: 'GET' },
      cache,
    ),
  ).resolves.toEqual({
    ok: true,
  })
  expect(writes).toHaveLength(1)
})

test('requestJsonBatch handles empty and oversized request lists', async () => {
  await expect(
    requestJsonBatch<readonly unknown[]>(failOnFetch, [], credentials),
  ).resolves.toEqual([])

  const requests = Array.from({ length: 11 }, (_, index) => {
    return {
      path: `/cards/card-${index}`,
    }
  })
  await expect(
    requestJsonBatch<readonly unknown[]>(failOnFetch, requests, credentials),
  ).rejects.toThrow('Draw batch requests support at most 10 requests')
})

test('requestJsonBatch rejects outer request failures', async () => {
  const failedResponse: DrawResponse = {
    async json(): Promise<unknown> {
      return undefined
    },
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
    async text(): Promise<string> {
      return 'batch unavailable'
    },
  }

  await expect(
    requestJsonBatch<readonly unknown[]>(
      async () => failedResponse,
      [{ path: '/cards/card-1' }],
      credentials,
    ),
  ).rejects.toThrow('Draw request failed: 503 batch unavailable')
})

test('requestJsonBatch rejects malformed subresponses', async () => {
  const malformedValues: readonly unknown[] = [
    undefined,
    [],
    [undefined],
    [[]],
    [{}],
    [{ 200: [], 201: [] }],
  ]

  for (const value of malformedValues) {
    const response: DrawResponse = {
      async json(): Promise<unknown> {
        return value
      },
      ok: true,
      status: 200,
      statusText: 'OK',
      async text(): Promise<string> {
        return ''
      },
    }
    await expect(
      requestJsonBatch<readonly unknown[]>(
        async () => response,
        [{ path: '/cards/card-1' }],
        credentials,
      ),
    ).rejects.toThrow('Draw batch request returned an invalid response')
  }
})

test('requestJsonBatch includes structured subrequest errors', async () => {
  const response: DrawResponse = {
    async json(): Promise<unknown> {
      return [{ 500: { message: 'Internal error' } }]
    },
    ok: true,
    status: 200,
    statusText: 'OK',
    async text(): Promise<string> {
      return ''
    },
  }

  await expect(
    requestJsonBatch<readonly unknown[]>(
      async () => response,
      [{ path: '/cards/card-1' }],
      credentials,
    ),
  ).rejects.toThrow('Draw request failed: 500 {"message":"Internal error"}')
})

test('cache helpers tolerate read and delete failures', async () => {
  const cache: DrawApiCache = {
    async delete(): Promise<void> {
      throw new Error('Delete failed')
    },
    async read<T>(): Promise<T | undefined> {
      throw new Error('Read failed')
    },
    async write(): Promise<void> { },
  }

  await expect(
    readCachedJson(cache, '/boards', credentials),
  ).resolves.toBeUndefined()
  await expect(
    deleteCachedJson(cache, '/boards', credentials),
  ).resolves.toBeUndefined()
})

test('trello api caches gracefully disable themselves without Web Crypto', async () => {
  await withCryptoUnavailable(async () => {
    expect(await getCredentialFingerprint(credentials)).toBeUndefined()
    expect(
      await createDrawApiCacheRequestUrl(
        createDrawRequestUrl('/boards', credentials),
        credentials,
      ),
    ).toBeUndefined()

    const cacheStorage = {
      async open(): Promise<Cache> {
        throw new Error('Cache Storage should not be opened')
      },
    } as unknown as CacheStorage
    const cache = createCacheStorageDrawApiCache(cacheStorage)
    expect(cache).toBeDefined()
    await expect(
      cache?.read(createDrawRequestUrl('/boards', credentials), credentials),
    ).resolves.toBeUndefined()
    await expect(
      cache?.write(
        createDrawRequestUrl('/boards', credentials),
        credentials,
        [],
      ),
    ).resolves.toBeUndefined()
    await expect(
      cache?.delete(
        createDrawRequestUrl('/boards', credentials),
        credentials,
      ),
    ).resolves.toBeUndefined()

    const memoryCache = createMemoryDrawApiCache()
    await expect(
      memoryCache.read(
        createDrawRequestUrl('/boards', credentials),
        credentials,
      ),
    ).resolves.toBeUndefined()
    await memoryCache.write(
      createDrawRequestUrl('/boards', credentials),
      credentials,
      [],
    )
    await memoryCache.delete(
      createDrawRequestUrl('/boards', credentials),
      credentials,
    )
    expect(memoryCache.keys()).toEqual([])
  })
})

test('cache storage factory and reads handle unavailable data', async () => {
  const originalCaches = globalThis.caches
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: undefined,
  })
  try {
    expect(createCacheStorageDrawApiCache()).toBeUndefined()
  } finally {
    Object.defineProperty(globalThis, 'caches', {
      configurable: true,
      value: originalCaches,
    })
  }

  const cacheStorage = {
    async open(): Promise<Cache> {
      return {
        async match(): Promise<undefined> {
          return undefined
        },
      } as unknown as Cache
    },
  } as unknown as CacheStorage
  const cache = createCacheStorageDrawApiCache(cacheStorage)
  await expect(
    cache?.read(createDrawRequestUrl('/boards', credentials), credentials),
  ).resolves.toBeUndefined()

  const memoryCache = createMemoryDrawApiCache()
  await expect(
    memoryCache.read(
      createDrawRequestUrl('/missing', credentials),
      credentials,
    ),
  ).resolves.toBeUndefined()
})

test('cached compound requests require every response part', async () => {
  const missingCache: DrawApiCache = {
    async delete(): Promise<void> { },
    async read<T>(): Promise<T | undefined> {
      return undefined
    },
    async write(): Promise<void> { },
  }
  await expect(
    readCachedBoardDetail(missingCache, board, credentials),
  ).resolves.toBeUndefined()
  await expect(
    readCachedSearch(missingCache, 'ship', credentials),
  ).resolves.toBeUndefined()
  await expect(
    readCachedCardDetail(missingCache, card, credentials),
  ).resolves.toBeUndefined()

  const partialBoardCache: DrawApiCache = {
    async delete(): Promise<void> { },
    async read<T>(requestUrl: string): Promise<T | undefined> {
      if (new URL(requestUrl).pathname.endsWith('/lists')) {
        return [{ id: 'list-1', name: 'Todo' }] as T
      }
      return undefined
    },
    async write(): Promise<void> { },
  }
  await expect(
    readCachedBoardDetail(partialBoardCache, board, credentials),
  ).resolves.toBeUndefined()
})

test('moveCard supports cards that have no source list', async () => {
  const requests: string[] = []
  const fetchLike: FetchLike = async (url) => {
    requests.push(url)
    return {
      async json(): Promise<unknown> {
        return {
          ...card,
          idList: 'list-2',
        }
      },
      ok: true,
      status: 200,
      statusText: 'OK',
      async text(): Promise<string> {
        return ''
      },
    }
  }

  await expect(
    moveCard(fetchLike, card, { idList: 'list-2', pos: 'bottom' }, credentials),
  ).resolves.toMatchObject({
    idList: 'list-2',
  })
  expect(requests).toHaveLength(1)
})

test('createDrawClient can use the global fetch default', async () => {
  const originalFetch = globalThis.fetch
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: async (): Promise<Response> => Response.json([]),
  })
  try {
    await expect(createDrawClient().listBoards(credentials)).resolves.toEqual(
      [],
    )
  } finally {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      value: originalFetch,
    })
  }
})
