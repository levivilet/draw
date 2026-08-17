import type { TestApi } from '@lvce-editor/test-with-playwright'

type Command = TestApi['Command']
type Expect = TestApi['expect']
type Locator = TestApi['Locator']

export interface DrawBoard {
  readonly id: string
  readonly name: string
}

export interface DrawCard {
  readonly desc?: string
  readonly id: string
  readonly labels?: readonly DrawLabel[]
  readonly name: string
}

export interface DrawLabel {
  readonly color?: string
  readonly id: string
  readonly name?: string
}

export interface DrawCardDetail {
  readonly attachments: readonly unknown[]
  readonly card: DrawCard
  readonly comments: readonly unknown[]
}

export interface DrawList {
  readonly cards: readonly DrawCard[]
  readonly id: string
  readonly name: string
}

export interface DrawBoardDetail {
  readonly board: DrawBoard
  readonly lists: readonly DrawList[]
}

export interface MockDrawData {
  readonly boardDetailErrors?: Readonly<Record<string, string>>
  readonly boardDetails?: Readonly<Record<string, DrawBoardDetail>>
  readonly boardLabels?: Readonly<Record<string, readonly DrawLabel[]>>
  readonly boards?: readonly DrawBoard[]
  readonly cardDetails?: Readonly<Record<string, DrawCardDetail>>
  readonly error?: string
  readonly listBoardsError?: string
  readonly listBoardsResponses?: readonly (readonly DrawBoard[])[]
}

export const createCards = (count: number): readonly DrawCard[] => {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1
    return {
      id: `card-${number}`,
      name: `Card ${number}`,
    }
  })
}

export const createList = (
  id: string,
  name: string,
  cards: readonly DrawCard[],
): DrawList => {
  return {
    cards,
    id,
    name,
  }
}

export const createBoardDetail = (
  board: DrawBoard,
  lists: readonly DrawList[],
): DrawBoardDetail => {
  return {
    board,
    lists,
  }
}

export const createMockData = (
  boards: readonly DrawBoard[],
  boardDetails: Readonly<
    Record<string, DrawBoardDetail>
  > = Object.fromEntries(
    boards.map((board) => [
      board.id,
      createBoardDetail(board, [createList('list-1', 'Todo', createCards(1))]),
    ]),
  ),
): MockDrawData => {
  return {
    boardDetails,
    boards,
  }
}

export const createBoards = (count: number): readonly DrawBoard[] => {
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1
    return {
      id: `board-${number}`,
      name: number === 1 ? 'Roadmap' : `Board ${number}`,
    }
  })
}

export const useMockDataAndShowDraw = async (
  Command: Command,
  mockData: Readonly<MockDrawData>,
): Promise<void> => {
  await Command.executeExtensionCommand('trello.test.useMockData', mockData)
  await Command.executeExtensionCommand('trello.show')
}

export const connectWithCredentials = async ({
  Command,
  expect,
  Locator,
}: Readonly<
  Pick<TestApi, 'Command' | 'expect' | 'Locator'>
>): Promise<void> => {
  const apiKey = Locator('input[name="apiKey"]')
  const token = Locator('input[name="token"]')
  await expect(apiKey).toBeVisible()
  await expect(token).toBeVisible()
  await apiKey.type('abcdefghijklmnopqrstuvwxyz123456')
  await token.type(
    'abcdefghijklmnopqrstuvwxyz123456abcdefghijklmnopqrstuvwxyz123456',
  )
  const connect = Locator('button[name="connect"]')
  await expect(connect).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await connect.click()
  await Command.execute('Timeout.sleep', 200)
}

export const openBoard = async (
  Command: Command,
  Locator: Locator,
  expect: Expect,
  boardId = 'board-1',
): Promise<void> => {
  const board = Locator(`button[name="board:${boardId}"]`)
  await expect(board).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await board.click()
  await Command.execute('Timeout.sleep', 200)
}

export const openCard = async (
  Command: Command,
  Locator: Locator,
  expect: Expect,
  cardId = 'card-1',
): Promise<void> => {
  const card = Locator(`button[name="card:${cardId}"]`)
  await expect(card).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await card.click()
  await Command.execute('Timeout.sleep', 200)
}
