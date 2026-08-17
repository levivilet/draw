import * as ExtensionApi from '@lvce-editor/api'
import type { DrawViewDependencies } from '../DrawViewState/DrawViewState.ts'
import {
  batchRequestsEnabledPreference,
  boardBackgroundEnabledPreference,
  cardDetailPopupEnabledPreference,
  searchEnabledPreference,
} from '../Constants/Constants.ts'
import { createSecretCredentialStorage } from '../CredentialStorage/CredentialStorage.ts'
import { createCacheCurrentBoardStorage } from '../CurrentBoardStorage/CurrentBoardStorage.ts'
import { createCacheRecentBoardStorage } from '../RecentBoardStorage/RecentBoardStorage.ts'
import { createDrawClient } from '../DrawClient/DrawClient.ts'
import { createDrawImageCache } from '../DrawImageCache/DrawImageCache.ts'

type DependencyFactory = () => DrawViewDependencies

const readSearchEnabledPreference = async (): Promise<boolean> => {
  const api = ExtensionApi as unknown as {
    readonly getPreference?: (key: string) => Promise<unknown>
  }
  return (await api.getPreference?.(searchEnabledPreference)) === true
}

const readBoardBackgroundEnabledPreference = async (): Promise<boolean> => {
  const api = ExtensionApi as unknown as {
    readonly getPreference?: (key: string) => Promise<unknown>
  }
  return (await api.getPreference?.(boardBackgroundEnabledPreference)) === true
}

export const readCardDetailPopupEnabledPreference =
  async (): Promise<boolean> => {
    const api = ExtensionApi as unknown as {
      readonly getPreference?: (key: string) => Promise<unknown>
    }
    return (
      (await api.getPreference?.(cardDetailPopupEnabledPreference)) === true
    )
  }

const readBatchRequestsEnabledPreference = async (): Promise<boolean> => {
  const api = ExtensionApi as unknown as {
    readonly getPreference?: (key: string) => Promise<unknown>
  }
  return (await api.getPreference?.(batchRequestsEnabledPreference)) === true
}

const defaultDependencyFactory = (): DrawViewDependencies => ({
  client: createDrawClient(undefined, undefined, {
    readBatchRequestsEnabled: readBatchRequestsEnabledPreference,
  }),
  currentBoardStorage: createCacheCurrentBoardStorage(),
  imageCache: createDrawImageCache(),
  readBoardBackgroundEnabled: readBoardBackgroundEnabledPreference,
  readCardDetailPopupEnabled: readCardDetailPopupEnabledPreference,
  readSearchEnabled: readSearchEnabledPreference,
  recentStorage: createCacheRecentBoardStorage(),
  storage: createSecretCredentialStorage(ExtensionApi),
})

export const dependencyState: { factory: DependencyFactory } = {
  factory: defaultDependencyFactory,
}

export const setDrawViewDependencyFactory = (
  factory: DependencyFactory,
): void => {
  dependencyState.factory = factory
}

export const resetDrawViewDependencyFactory = (): void => {
  dependencyState.factory = defaultDependencyFactory
}
