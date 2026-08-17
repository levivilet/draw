import {
  activate as activateExtensionApi,
  executeCommand,
  registerCommand,
  registerView,
} from '@lvce-editor/api'
import {
  createCacheCredentialStorage,
  testCacheName as testCredentialCacheName,
} from '../CredentialStorage/CredentialStorage.ts'
import {
  createCacheCurrentBoardStorage,
  testCacheName as testCurrentBoardCacheName,
} from '../CurrentBoardStorage/CurrentBoardStorage.ts'
import {
  createMockDrawClient,
  type MockDrawData,
} from '../MockDrawClient/MockDrawClient.ts'
import {
  createCacheRecentBoardStorage,
  testCacheName as testRecentBoardCacheName,
} from '../RecentBoardStorage/RecentBoardStorage.ts'
import { clearDrawTestCaches } from '../TestStorage/TestStorage.ts'
import * as DrawView from '../DrawView/DrawView.ts'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
  registerView(DrawView.view)
  registerCommand({
    execute() {
      return executeCommand('Layout.toggleSideBarView', DrawView.viewId)
    },
    id: 'trello.show',
  })
  registerCommand({
    execute() {
      return DrawView.cancelNewCardActiveDrawViewInstance()
    },
    id: 'trello.cancelNewCard',
  })
  registerCommand({
    execute() {
      return DrawView.closeCardDetailActiveDrawViewInstance()
    },
    id: 'trello.closeCardDetail',
  })
  registerCommand({
    execute() {
      return DrawView.closeBoardFilterActiveDrawViewInstance()
    },
    id: 'trello.closeBoardFilter',
  })
  registerCommand({
    execute(cardId: string) {
      return DrawView.openCardActiveDrawViewInstance(cardId)
    },
    id: 'trello.openCard',
  })
  registerCommand({
    execute() {
      return DrawView.saveCardDetailActiveDrawViewInstance()
    },
    id: 'trello.saveCardDetail',
  })
  registerCommand({
    execute(listId: string) {
      return DrawView.startAddCardActiveDrawViewInstance(listId)
    },
    id: 'trello.startAddCard',
  })
  registerCommand({
    execute() {
      return DrawView.submitNewCardActiveDrawViewInstance()
    },
    id: 'trello.submitNewCard',
  })
  registerCommand({
    execute(options: any) {
      return DrawView.addList(options)
    },
    id: 'trello.addList',
  })
  registerCommand({
    execute(options: any) {
      return DrawView.openMockBoard(options)
    },
    id: 'trello.openMockBoard',
  })
  registerCommand({
    execute(options: any) {
      return DrawView.addCard(options)
    },
    id: 'trello.addCard',
  })
  registerCommand({
    async execute(data: Readonly<MockDrawData>) {
      await clearDrawTestCaches()
      DrawView.setDrawViewDependencyFactory(() => ({
        client: createMockDrawClient(data),
        currentBoardStorage: createCacheCurrentBoardStorage(
          testCurrentBoardCacheName,
        ),
        isTest: true,
        readCardDetailPopupEnabled:
          DrawView.readCardDetailPopupEnabledPreference,
        recentStorage: createCacheRecentBoardStorage(testRecentBoardCacheName),
        storage: createCacheCredentialStorage(testCredentialCacheName),
      }))
      await DrawView.reloadActiveDrawViewInstances()
      return { ok: true }
    },
    id: 'trello.test.useMockData',
  })
  registerCommand({
    async execute() {
      DrawView.resetDrawViewDependencyFactory()
      await DrawView.reloadActiveDrawViewInstances()
      return { ok: true }
    },
    id: 'trello.test.reset',
  })
}

export const deactivate = (): void => { }
