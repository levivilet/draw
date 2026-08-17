import type {
  DrawBoard,
  DrawCard,
  DrawSearchResult,
} from '../DrawTypes/DrawTypes.ts'

export interface DrawSearchResponse {
  readonly boards?: readonly DrawBoard[]
  readonly cards?: readonly DrawCard[]
}

export const normalizeSearchResponse = (
  response: Readonly<DrawSearchResponse>,
): readonly DrawSearchResult[] => {
  const cards = response.cards || []
  const boards = response.boards || []
  return [
    ...cards.map((card): DrawSearchResult => {
      return {
        ...card,
        type: 'card',
      }
    }),
    ...boards.map((board): DrawSearchResult => {
      return {
        ...board,
        type: 'board',
      }
    }),
  ]
}
