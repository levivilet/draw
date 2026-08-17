import type { Test } from '@lvce-editor/test-with-playwright'
import {
  connectWithCredentials,
  createBoards,
  createMockData,
  openBoard,
  useMockDataAndShowDraw,
} from './_trello.virtual-dom-view.shared.ts'

export const name = 'trello.virtual-dom-view.dynamic-sidebar-title'
export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  const boards = createBoards(1)
  await useMockDataAndShowDraw(Command, createMockData(boards))
  await connectWithCredentials({ Command, expect, Locator })
  await openBoard(Command, Locator, expect)

  const sidebarTitle = Locator('.SideBarTitleAreaTitle')
  const boardTitle = Locator('drawTitle')
  await expect(sidebarTitle).toHaveText('Draw: Roadmap')
  await expect(boardTitle).toHaveCount(0)
}
