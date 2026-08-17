import { testCacheName as testCredentialCacheName } from '../CredentialStorage/CredentialStorage.ts'
import { testCacheName as testCurrentBoardCacheName } from '../CurrentBoardStorage/CurrentBoardStorage.ts'
import { testCacheName as testRecentBoardCacheName } from '../RecentBoardStorage/RecentBoardStorage.ts'
import { testDrawApiCacheName } from '../DrawApiCache/DrawApiCache.ts'
import { testDrawImageCacheName } from '../DrawImageCache/DrawImageCache.ts'

export const testCacheNames = [
  testCredentialCacheName,
  testCurrentBoardCacheName,
  testRecentBoardCacheName,
  testDrawApiCacheName,
  testDrawImageCacheName,
] as const

export const clearDrawTestCaches = async (
  cacheStorage: Readonly<CacheStorage> | undefined = globalThis.caches,
): Promise<void> => {
  if (!cacheStorage) {
    return
  }
  await Promise.all(
    testCacheNames.map((cacheName) => {
      return cacheStorage.delete(cacheName)
    }),
  )
}
