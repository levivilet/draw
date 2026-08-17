import type { Test } from '@lvce-editor/test-with-playwright'
import {
  connectWithCredentials,
  createBoards,
  createMockData,
  useMockDataAndShowDraw,
} from './_trello.virtual-dom-view.shared.ts'

export const name = 'trello.virtual-dom-view.boards-two'
// export const skip = true

export const test: Test = async ({ Command, expect, Locator }) => {
  const boards = createBoards(2)
  await useMockDataAndShowDraw(Command, createMockData(boards))
  await connectWithCredentials({ Command, expect, Locator })

  const boardButtons = Locator('drawBoardButton')
  const roadmap = Locator('button[name="board:board-1"]')
  const boardTwo = Locator('button[name="board:board-2"]')

  await expect(boardButtons).toHaveCount(2)
  await expect(roadmap).toHaveText('Roadmap')
  await expect(boardTwo).toHaveText('Board 2')
}
